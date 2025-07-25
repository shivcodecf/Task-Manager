# Full-Stack Role-Based Dashboard (MERN Stack)

A full-stack web application built using the **MERN stack** (MongoDB, Express.js, React.js, Node.js) that supports **role-based login** (Admin/User), authentication, and protected routes with separate dashboards for each user type.

---

## 📁 Project Structure

```bash
.
├── backened/                # Node.js + Express backend
│   ├── config/              # DB connection setup
│   ├── controllers/         # Login/Signup logic
│   ├── middlewares/         # Auth middleware (JWT)
│   ├── models/              # Mongoose user model
│   ├── routes/              # Auth routes (signup, login)
│   ├── index.js             # Main server file
│   └── package.json
│
├── frontened/               # React.js frontend (Vite)
│   ├── src/
│   │   ├── admin/           # Admin dashboard
│   │   ├── assets/          # Static assets
│   │   ├── contexts/        # Auth context
│   │   ├── ui/              # Login, Signup, Navbar, etc.
│   │   ├── user/            # User dashboard
│   │   ├── ProtectedRoute.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── index.html
│   └── package.json

```

🚀 Features
🔐 Role-based authentication (User & Admin)

🌐 JWT-based login/session management

🔒 Protected routes using React Router

📦 MongoDB database for user storage

⚛️ React Context API for global auth state

💥 Vite for blazing-fast frontend dev experience


🛠️ Tech Stack
Frontend: React.js (with Vite), Tailwind CSS

Backend: Node.js, Express.js

Database: MongoDB + Mongoose

Authentication: JWT (JSON Web Tokens)



📲 Installation & Setup

Backend

```bash

cd backened
npm install
npm run dev

```

Make sure to add a .env file with:

```bash

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000

```

Frontend

```bash

cd frontened
npm install
npm run dev

```

📸 UI Preview

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/409e042a-8e37-4abf-829b-3fe42054a70a" />

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/98ef5c57-8b4c-499e-b537-d2fc1d8d2964" />

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/e5bded28-1c47-411a-96e1-339f6473677e" />

Made with ❤️ by Shivam Yadav
Feel free to connect on LinkedIn or contribute to this repo!











