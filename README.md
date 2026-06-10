<div align="center">

# 🚗 CarRental

### A full-stack dual-role car rental platform built with the MERN stack

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://car-rental-indol-delta.vercel.app)
[![JavaScript](https://img.shields.io/badge/JavaScript-99%25-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://github.com/Aman739-code/carRental)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![React](https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)

</div>

---

## 📌 Overview

**CarRental** is a full-stack web application that connects **car owners** and **renters** on a single unified platform. Owners can list their vehicles, manage bookings, and track earnings — while customers can browse available cars, make reservations, and manage their rental history.

> 🔗 **Live:** [car-rental-indol-delta.vercel.app](https://car-rental-indol-delta.vercel.app)

---

## ✨ Features

### 👤 Customer Role
- Browse and search available rental cars
- View car details (specs, pricing, availability)
- Book a car for a custom date range
- Manage booking history and upcoming rentals

### 🧑‍💼 Owner Role
- List cars with photos, description, and pricing
- Accept or reject incoming booking requests
- Track rental status and earnings dashboard
- Manage your fleet from a dedicated owner panel

### 🔐 Auth & General
- JWT-based authentication (register / login)
- Role-based access control (customer vs. owner)
- Protected routes on both frontend and backend
- Responsive UI across all screen sizes

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React.js, React Router, Axios, CSS / Tailwind |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Atlas) + Mongoose |
| **Auth** | JSON Web Tokens (JWT) |
| **Deployment** | Vercel (frontend), Render / Railway (backend) |

---

## 📁 Project Structure

```
carRental/
├── client/          # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── App.jsx
│   └── package.json
│
├── server/          # Express backend
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   └── index.js
│
└── .gitignore
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas URI
- npm or yarn

### 1. Clone the repository
```bash
git clone https://github.com/Aman739-code/carRental.git
cd carRental
```

### 2. Setup the Backend
```bash
cd server
npm install
```

Create a `.env` file in `/server`:
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
```

```bash
npm start
```

### 3. Setup the Frontend
```bash
cd ../client
npm install
npm start
```

The app will run on `http://localhost:3000` with the API on `http://localhost:5000`.

---

## 🌐 Deployment

- **Frontend** is deployed on [Vercel](https://vercel.com) — push to `main` auto-deploys.
- **Backend** can be deployed to Render, Railway, or any Node-compatible platform.
- Set the production API base URL in the client's environment variables:
  ```env
  REACT_APP_API_URL=https://your-backend-url.com
  ```

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you'd like to change.

1. Fork the repo
2. Create your feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

Made with ❤️ by [Aman Bhatnagar](https://github.com/Aman739-code)

⭐ Star this repo if you found it useful!

</div>
