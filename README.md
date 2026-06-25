# 🎉 Eventora – Event Management Platform

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-brightgreen?logo=mongodb)
![JWT](https://img.shields.io/badge/Auth-JWT-orange)
![Brevo](https://img.shields.io/badge/Email-Brevo-blue)
![Vercel](https://img.shields.io/badge/Frontend-Vercel-black?logo=vercel)
![Render](https://img.shields.io/badge/Backend-Render-46E3B7)

Eventora is a full-stack event management platform that enables users to discover, create, and book events with a secure authentication system powered by Email OTP verification and JWT authentication.

Designed with a modern React frontend and a scalable Express + MongoDB backend, Eventora focuses on providing a seamless event booking experience while following industry-standard authentication and deployment practices.

---

## 🚀 Live Demo

🌐 **Frontend:** [[https://your-vercel-url.vercel.app](https://eventora-event-management-platform.vercel.app/)]



---

# ✨ Features

### 👤 Authentication

- User Registration
- Secure Login
- Email OTP Verification
- JWT Authentication
- Password Hashing
- Protected Routes

---

### 🎫 Event Management

- Browse Upcoming Events
- View Event Details
- Search & Filter Events
- Book Event Tickets
- Seat Availability Tracking
- Organizer Event Creation

---

### 📧 Email System

- OTP Verification via Brevo
- Secure Email API Integration
- HTTPS-based Email Delivery

---

### 📱 User Experience

- Responsive Design
- Modern UI
- Fast Navigation
- Loading States
- Error Handling
- Form Validation

---

# 🛠 Tech Stack

## Frontend

- React.js
- Vite
- Tailwind CSS
- Axios
- React Router

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose

## Authentication

- JWT
- bcrypt
- Email OTP

## Email Service

- Brevo API

## Deployment

- Vercel (Frontend)
- Render (Backend)

---

# 📂 Project Structure

```
Eventora
│
├── client
│   ├── src
│   ├── public
│   ├── package.json
│   └── ...
│
├── server
│   ├── controller
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── utils
│   │   └── email.js
│   ├── seedEvents.js
│   ├── package.json
│   └── index.js
│
└── README.md
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/makracoder/Eventora-Event-Management-Platform.git

cd Eventora-Event-Management-Platform
```

---

## Backend Setup

```bash
cd server

npm install
```

Create a `.env` file:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

BREVO_API_KEY=your_brevo_api_key
```

Run backend:

```bash
npm run dev
```

---

## Frontend Setup

```bash
cd client

npm install

npm run dev
```

---

# 📧 Environment Variables

| Variable | Description |
|-----------|-------------|
| PORT | Server Port |
| MONGO_URI | MongoDB Connection String |
| JWT_SECRET | Secret for JWT Tokens |
| BREVO_API_KEY | Brevo Email API Key |

---

# 🔐 Authentication Flow

```
User Registers
       │
       ▼
Generate OTP
       │
       ▼
Brevo Email API
       │
       ▼
User Receives OTP
       │
       ▼
OTP Verification
       │
       ▼
JWT Generated
       │
       ▼
Access Protected Routes
```

---

# 📸 Screenshots

## Home Page

> Add screenshot here

---

## Event Details

> Add screenshot here

---

## Login

> Add screenshot here

---

## Register

> Add screenshot here

---

## Dashboard

> Add screenshot here

---

# 🌟 Highlights

- Secure JWT Authentication
- Email OTP Verification
- RESTful API Architecture
- MongoDB Database Design
- Responsive React UI
- Production Deployment
- Clean Folder Structure

---

# 🧠 Challenges Faced

One of the key challenges during development was deploying the email verification system.

Initially the application used Gmail SMTP with Nodemailer. While deploying to Render, outbound SMTP connections were blocked on the free tier, preventing OTP emails from being sent.

To solve this, the application was migrated to **Brevo's HTTP Email API**, eliminating the dependency on SMTP ports and enabling reliable email delivery in production.

This project also provided hands-on experience with:

- Environment Variable Management
- Production Deployment
- API Integration
- Authentication Workflows
- Debugging Infrastructure Issues

---

# 🚀 Future Improvements

- Google OAuth Login
- Event Categories
- Event Reviews
- Payment Gateway Integration
- QR Code Tickets
- Organizer Dashboard
- Admin Analytics
- Notifications
- Calendar Integration
- Dark Mode

---

# 👨‍💻 Author

**Aditya**

B.Tech CSE Student

Passionate about Full Stack Development, Backend Engineering, and Problem Solving.

GitHub:

https://github.com/makracoder

---

# ⭐ Support

If you found this project helpful, consider giving it a ⭐ on GitHub.

It motivates me to build more open-source projects.
