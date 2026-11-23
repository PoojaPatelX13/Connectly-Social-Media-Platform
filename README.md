# Connectly – Social Media Platform

A full-stack social media platform built using the MERN Stack. Connectly allows users to connect, share posts, interact with other users, and manage their profiles through a modern and responsive interface.

## Features

- User Registration and Login
- Secure Authentication
- Create and Delete Posts
- Like and Unlike Posts
- Comment on Posts
- Follow and Unfollow Users
- User Profile Management
- Explore and Search Users
- Responsive Dashboard
- Light and Dark Mode

## Technologies Used

**Frontend**
- React.js
- JavaScript
- HTML5
- CSS3
- Vite

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication

## Project Structure

```text
Connectly/
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   └── pages/
│   └── package.json
│
├── .gitignore
└── README.md
```

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/PoojaPatelX13/Connectly-Social-Media-Platform.git
```

### 2. Navigate to the Project

```bash
cd Connectly-Social-Media-Platform
```

### 3. Setup Backend

```bash
cd backend
npm install
```

Configure your environment variables in a `.env` file using your project's existing variable names.

Start the backend:

```bash
node server.js
```

### 4. Setup Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL displayed by Vite in your browser.

## Application

**Frontend:** http://localhost:5173

**Backend:** http://localhost:5000

## Author

**Pooja Patel**

BCA Student | Aspiring Software Developer

## License

This project was developed for educational and learning purposes.
