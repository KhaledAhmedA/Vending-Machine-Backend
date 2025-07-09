# 🥤 Vending Machine API

A RESTful API for a vending machine built with **Node.js**, **Express**, **TypeScript**, and **MongoDB**. It supports role-based access control for buyers and sellers, allowing users to register, deposit coins, purchase products, and manage inventory.

---

## 🚀 Features

- 🔐 JWT-based Authentication
- 👥 Role-based Access: `buyer`, `seller`
- 🛒 Buyers can:
  - Deposit coins (5, 10, 20, 50, 100)
  - Buy products
  - Reset deposit
- 🧑‍💼 Sellers can:
  - Create, update, delete, and list products
- 🧾 Account management
- ✅ Unit tests with Jest and Supertest

---

## 📁 Project Structure

src/
├── controllers/
├── middleware/
├── models/
├── routes/
├── tests/
├── utils/
├── app.ts
└── server.ts

---

## 🧰 Tech Stack

- **Node.js** + **Express**
- **TypeScript**
- **MongoDB** + **Mongoose**
- **Jest** + **Supertest** for testing
- **dotenv** for environment config
- **bcryptjs** for password hashing
- **jsonwebtoken** for authentication

---

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/vending-machine-api.git
cd vending-machine-api

2. Install Dependencies
npm install

3. Environment Variables
Create a .env file in the root with the following:

- .env
PORT=5000
MONGO_URI=mongodb://localhost:27017/vending_machine
JWT_SECRET=your_jwt_secret


4. Run the Server

# Development
npm run dev

# Production
npm run build
npm start
✅ Running Tests

# Run tests in sequence and detect async leaks
npm test -- --runInBand --detectOpenHandles
 API Endpoints
🧑 Auth
Method	Endpoint	Description
POST	/auth/signup	Register new user
POST	/auth/login	Login and get token

👤 Account
Method	Endpoint	Description
GET	/account/me	Get current user profile
PUT	/account/me	Update username, password, or role

🪙 Buyer
Method	Endpoint	Description
POST	/deposit	Deposit coins (buyer)
POST	/reset	Reset deposit (buyer)
POST	/buy	Buy product (buyer)
GET	/deposit	Get current deposit

📦 Products (Seller only)
Method	Endpoint	Description
GET	/products	List all products
POST	/products	Create a product
PUT	/products/:id	Update a product
DELETE	/products/:id	Delete a product

🔐 Roles & Permissions
buyer:

Deposit, buy, reset deposit

seller:

Create, update, delete products

Role is assigned on registration and can be updated via PUT /account/me.

📜 License
MIT

👨‍💻 Author
Developed by Khaled Ahmed
https://khaled-iota.vercel.app/

Feel free to contribute or raise issues!

---