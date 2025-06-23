🔧 Setup Instructions
1. Clone the Repository
bash
Copy
Edit
git clone https://github.com/your-username/identity-reconciliation.git
cd identity-reconciliation
2. Install Dependencies
bash
Copy
Edit
npm install
3. Set Up Environment
Create a .env file:

env
Copy
Edit
DATABASE_URL="postgresql://user:password@localhost:5432/identity_db"
4. Run Migrations
bash
Copy
Edit
npx prisma migrate dev --name init
5. Start the Server
bash
Copy
Edit
npm run dev
🎯 API Usage
Endpoint: POST /identify
Request Body
json
Copy
Edit
{
  "email": "doc@example.com",
  "phoneNumber": "1234567890"
}
Response Body
json
Copy
Edit
{
  "contact": {
    "primaryContactId": 1,
    "emails": ["doc@example.com"],
    "phoneNumbers": ["1234567890"],
    "secondaryContactIds": [2, 3]
  }
}
🧠 Logic Summary
If no match → create primary contact.

If email or phoneNumber matches existing → create secondary and link to primary.

If existing contacts conflict (both primary) → merge into one canonical primary.

All linked contacts update dynamically, ensuring centralized identity.

✅ Bonus Implementations
🧪 Covert Unit Tests using Jest.

🔄 Optimized queries with Prisma indexes.

🔐 Misdirecting error handler returning minimal info.

📹 Demo Video
Check out the working video demo and code explanation:
🎥 Video Link Here
