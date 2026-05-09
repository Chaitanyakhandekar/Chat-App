<div align="center">
  <h1>🚀 Next-Gen Real-Time Chat Application</h1>
  <p>A production-grade, highly scalable real-time chat application built with the MERN stack, Socket.IO, and Redis.</p>

  <!-- Badges -->
  <p>
    <img src="https://img.shields.io/badge/React-19.0-blue.svg?style=for-the-badge&logo=react" alt="React" />
    <img src="https://img.shields.io/badge/Node.js-Express-green.svg?style=for-the-badge&logo=nodedotjs" alt="Node.js" />
    <img src="https://img.shields.io/badge/MongoDB-Mongoose-success.svg?style=for-the-badge&logo=mongodb" alt="MongoDB" />
    <img src="https://img.shields.io/badge/Socket.IO-Real%20Time-black.svg?style=for-the-badge&logo=socketdotio" alt="Socket.IO" />
    <img src="https://img.shields.io/badge/Redis-Caching-red.svg?style=for-the-badge&logo=redis" alt="Redis" />
  </p>
</div>

---

## 📖 Table of Contents
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Scripts](#-scripts)
- [License](#-license)

---

## ✨ Features

- **Real-Time Messaging**: Lightning-fast 1v1 and group chats using WebSocket (Socket.IO).
- **Group Chats**: Create groups, add/remove members, and manage admin privileges.
- **Rich Media**: Share images and file attachments via Cloudinary integration.
- **Interactive UI**: Reactions, replies, typing indicators, and real-time read receipts.
- **Smart Notifications**: Push notifications for messages, mentions, and group invites.
- **Secure Authentication**: JWT-based authentication with separate access & refresh tokens, plus password hashing (Bcrypt).
- **Email Verification**: Secure account verification and password reset flows using Brevo/Nodemailer.
- **AI Integration**: Powered by Google GenAI for intelligent features.
- **Responsive Design**: Beautiful, mobile-first UI crafted with Tailwind CSS and Framer Motion/Lucide Icons.
- **State Management**: Robust client-side state handling with Zustand.

---

## 🛠 Tech Stack

### Frontend (Client)
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Routing**: React Router DOM v7
- **Real-Time**: Socket.IO Client
- **UI Libraries**: Lucide React, SweetAlert2, React Hot Toast

### Backend (Server)
- **Framework**: Node.js + Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Caching & Real-Time State**: Redis (ioredis)
- **WebSockets**: Socket.IO
- **Validation**: Zod
- **Storage**: Cloudinary (Multer for uploads)
- **Security**: JSON Web Tokens (JWT), Bcrypt
- **Email**: Brevo (Sendinblue) / Nodemailer

---

## 🏗 System Architecture

The application is designed following FAANG-grade system design principles:
- **Event-Driven Pub/Sub**: Uses Socket.IO and Redis to handle real-time fan-out message delivery to online participants.
- **Optimized Database Schema**: Intelligent use of referenced and embedded documents in MongoDB (e.g., denormalized `lastMessage` for fast read access).
- **Scalable WebSockets**: Session caching and online status tracking via Redis.

*(For an in-depth view of the architecture, indexing strategies, and ER diagrams, refer to the `system_design.md` file in the repository).*

---

## 🚀 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites

Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/en/download/) (v18+ recommended)
- [MongoDB](https://www.mongodb.com/try/download/community) (Local or Atlas URI)
- [Redis](https://redis.io/download) (Local or Cloud instance)
- [Cloudinary Account](https://cloudinary.com/) (For image uploads)
- [Brevo Account](https://www.brevo.com/) (For transactional emails)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/chat-app.git
   cd chat-app
   ```

2. **Setup the Backend:**
   ```bash
   cd server
   npm install
   ```

3. **Setup the Frontend:**
   ```bash
   cd ../client
   npm install
   ```

### Environment Variables

You need to set up environment variables for both the client and the server. 

#### Server (`server/.env`)
Create a `.env` file in the `server` directory and add the following keys:

```env
# Database
MONGODB_URI=your_mongodb_connection_string
MONGODB_PASSWORD=your_mongodb_password
MONGODB_USERNAME=your_mongodb_username

# Authentication
JWT_ACCESS_SECRET=your_jwt_access_secret
EXPIRES_IN_ACCESS_TOKEN=1d
EXPIRES_IN_REFRESH_TOKEN=7d

# Environment & URLs
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Redis
REDIS_HOST=your_redis_host
REDIS_PORT=your_redis_port
REDIS_PASSWORD=your_redis_password
REDIS_DB=0

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLOUDINARY_URL=your_cloudinary_url

# AI / External APIs
GOOGLE_GENAI_API_KEY=your_google_genai_api_key
```

#### Client (`client/.env`)
Create a `.env` file in the `client` directory:

```env
VITE_BACKEND_URL=http://localhost:3000
VITE_BACKEND_URL_PROD=your_production_backend_url
VITE_ENV=development
```

---

## 🏃 Scripts

### Running the Backend
From the `server` directory:
```bash
# Start in development mode with nodemon
npm run dev

# Start in production mode
npm start
```

### Running the Frontend
From the `client` directory:
```bash
# Start the Vite development server
npm run dev

# Build for production
npm run build
```

### Running Both
*Pro-tip: You can run both servers concurrently by opening two terminal windows or using a tool like `concurrently` at the root level.*

---

## 🛡️ License

This project is licensed under the [ISC License](LICENSE).
