import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
    log: ["query", "error"],
    errorFormat: "pretty",
});

export default prisma;