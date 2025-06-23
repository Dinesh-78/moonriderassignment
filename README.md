# 🕵️‍♂️ Identity Reconciliation Service – Zamazon & Moonrider

This project is a backend service built to **intelligently identify and link contacts** (emails and phone numbers) across multiple purchase records. It was built for the fictional integration between Zamazon.com and Moonrider's advanced personalization engine, aimed at handling **shadow identities** like those of Doc Chandrashekar.

---

## 📌 Features

- **/identify** endpoint for contact reconciliation.
- Smart detection of matching emails or phone numbers.
- Handles creation of `primary` and `secondary` contacts.
- Automatically updates links when overlaps are detected.
- Maintains `primaryContactId`, `emails`, `phoneNumbers`, and `secondaryContactIds`.

---

## 🗂️ Tech Stack

- **Node.js / Express** – RESTful API
- **Prisma ORM** – PostgreSQL database ORM
- **PostgreSQL** – Database
- **TypeScript / JavaScript** – Language
- **Jest** (Bonus) – Unit testing
- **Docker** (Optional) – For containerized development

---

## 🔧 Setup Instructions

### 1. Clone the Repository

bash
git clone https://github.com/Dinesh-78/identity-reconciliation.git
cd identity-reconciliation

### 2. Install Dependencies

npm install

### 3. Set Up Environment

DATABASE_URL="postgresql://user:password@localhost:5432/identity_db"

### 4. Run Migrations

npx prisma migrate dev --name init

### 5. start the Server

npm run dev

🎯 API Usage
Endpoint: POST /identify
Request Body

{
  "email": "doc@example.com",
  "phoneNumber": "1234567890"
}


Response Body

{
  "contact": {
    "primaryContactId": 1,
    "emails": ["doc@example.com"],
    "phoneNumbers": ["1234567890"],
    "secondaryContactIds": [2, 3]
  }
}


📹 Demo Video
Check out the working video demo and code explanation:

