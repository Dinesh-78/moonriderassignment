import { PrismaClient, LinkPrecedence } from '@prisma/client';

const prisma = new PrismaClient();

export interface IdentityResponse {
  contact: {
    primaryContactId: number;
    emails: string[];
    phoneNumbers: string[];
    secondaryContactIds: number[];
  };
}

export const processIdentityservice = async (
  email?: string,
  phoneNumber?: string
): Promise<IdentityResponse> => {
  //  Find matching contacts
  const matchedContacts = await prisma.user.findMany({
    where: {
      OR: [
        email ? { email } : undefined,
        phoneNumber ? { phoneNumber } : undefined,
      ].filter(Boolean) as any
    },
    orderBy: { createdAt: 'asc' }
  });

  // No matches Then create a new PRIMARY contact
  if (matchedContacts.length === 0) {
    const newContact = await prisma.user.create({
      data: {
        email,
        phoneNumber,
        linkPrecedence: LinkPrecedence.primary,
      }
    });

    return buildResponsePayload(newContact.id, [email!], [phoneNumber!], []);
  }

  // Identify the root primary contact (oldest)
  const primaryContacts = matchedContacts.filter(c => c.linkPrecedence === 'primary');
  let primaryContact = primaryContacts[0];

  for (const contact of primaryContacts.slice(1)) {
    if (contact.createdAt < primaryContact.createdAt) {
      primaryContact = contact;
    }
  }

  //  Demote newer PRIMARYs to SECONDARY
  for (const contact of primaryContacts) {
    if (contact.id !== primaryContact.id) {
      await prisma.user.update({
        where: { id: contact.id },
        data: {
          linkPrecedence: LinkPrecedence.secondary,
          linkedId: primaryContact.id
        }
      });
    }
  }

  // If current email/phone is new info, create as SECONDARY
  const alreadyExists = matchedContacts.some(
    (c) => c.email === email && c.phoneNumber === phoneNumber
  );

  const existsWithEmail = matchedContacts.some((c) => c.email === email);
  const existsWithPhone = matchedContacts.some((c) => c.phoneNumber === phoneNumber);

  if (!alreadyExists && !(existsWithEmail && existsWithPhone)) {
    await prisma.user.create({
      data: {
        email,
        phoneNumber,
        linkPrecedence: LinkPrecedence.secondary,
        linkedId: primaryContact.id
      }
    });
  }

  // Fetch all related contacts (primary + secondaries)
  const relatedContacts = await prisma.user.findMany({
    where: {
      OR: [
        { id: primaryContact.id },
        { linkedId: primaryContact.id }
      ]
    },
    orderBy: { createdAt: 'asc' }
  });

  const emails = Array.from(new Set(relatedContacts.map(c => c.email).filter(Boolean))) as string[];
  const phoneNumbers = Array.from(new Set(relatedContacts.map(c => c.phoneNumber).filter(Boolean))) as string[];
  const secondaryContactIds = relatedContacts
    .filter(c => c.linkPrecedence === 'secondary')
    .map(c => c.id);

  return buildResponsePayload(primaryContact.id, emails, phoneNumbers, secondaryContactIds);
};

const buildResponsePayload = (
  primaryContactId: number,
  emails: string[],
  phoneNumbers: string[],
  secondaryContactIds: number[]
): IdentityResponse => {
  return {
    contact: {
      primaryContactId,
      emails,
      phoneNumbers,
      secondaryContactIds
    }
  };
};