# Pickup Games – Find and Join Local Sports Games

## Overview
Pickup Games is a full-stack web application that connects sports enthusiasts who want to create, find, and join casual games in their area. It helps users stay active and meet people with similar interests.

---

## Features
- **User Authentication** – secure registration and login  
- **Game Creation** – create games with sport, location, time, and skill level  
- **Game Discovery** – filter games by sport, location, and skill level  
- **User Profiles** – customize interests and skill levels  
- **Interactive Maps** – view game locations on a map  
- **Responsive Design** – works on desktop and mobile  

---

## Tech Stack

### Frontend
- React.js  
- React Router (navigation)  
- Formik & Yup (form validation)  
- Axios (API requests)  
- React-Toastify (notifications)  
- CSS (styling)  

### Backend
- Node.js  
- Express.js (API routing)  
- MongoDB (database)  
- Mongoose (object modeling)  
- JWT (authentication)  
- bcryptjs (password hashing)  
- Express Validator (request validation)  

---

## Getting Started

### Prerequisites
- Node.js (v14 or higher)  
- MongoDB  
- npm or yarn  

### Installation
```bash
# clone the repo
git clone https://github.com/yourusername/pickup-games.git
cd pickup-games
```

<details>
<summary>Install backend dependencies</summary>

```bash
cd backend
npm install
```
</details>

<details>
<summary>Install frontend dependencies</summary>

```bash
cd ../frontend
npm install
```
</details>

Create a `.env` file in **backend/**:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/pickup-games
JWT_SECRET=your_jwt_secret
```

### Running the Application
```bash
# start backend
cd backend
npm run dev
# start frontend
cd ../frontend
npm start
# open http://localhost:3000
```

---

## Docker Setup
```bash
docker-compose up
```
This starts the frontend, backend, and a MongoDB instance.

---

## API Endpoints

### Authentication
| Method | Route | Description |
| ------ | ----- | ----------- |
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login a user |
| GET  | `/api/auth/profile` | Get current user profile |

### Users
| Method | Route | Description |
| ------ | ----- | ----------- |
| GET  | `/api/users` | Get all users |
| GET  | `/api/users/:id` | Get user by ID |
| PUT  | `/api/users/:id` | Update user profile |
| PUT  | `/api/users/location` | Update user location |

### Games
| Method | Route | Description |
| ------ | ----- | ----------- |
| POST | `/api/games` | Create a new game |
| GET  | `/api/games` | Get all games (with filters) |
| GET  | `/api/games/:id` | Get game by ID |
| PUT  | `/api/games/:id` | Update game |
| DELETE | `/api/games/:id` | Delete game |
| POST | `/api/games/:id/join` | Join a game |
| POST | `/api/games/:id/leave` | Leave a game |

---

## Project Structure
```text
pickup-games/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── server.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── docker-compose.yml
└── README.md
```
