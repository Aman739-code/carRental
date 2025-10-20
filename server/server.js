// import express from "express";
// import "dotenv/config";
// import cors from "cors";
// import connectDB from "./configs/db.js";
// import userRouter from "./routes/userRoutes.js";
// import ownerRouter from "./routes/ownerRoute.js";
// import bookingRouter from "./routes/bookingRoutes.js";


// // Initialize Express App
// const app = express();

// // Connect Database
// await connectDB();

// // Middleware
// app.use(cors());
// app.use(express.json())

// app.get('/', (req, res) => res.send("Server is running"))
// app.use('/api/user', userRouter)
// app.use('/api/owner', ownerRouter)
// app.use('/api/bookings', bookingRouter)

// const PORT = process.env.PORT || 3000

// app.listen(PORT, () => console.log(`Server running on ${PORT}`))


import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import ownerRouter from "./routes/ownerRoute.js";
import bookingRouter from "./routes/bookingRoutes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const startServer = async () => {
  try {
    await connectDB();
    console.log("✅ MongoDB connected successfully");

    // Routes
    app.get("/", (req, res) => res.send("Server is running successfully!"));
    app.use("/api/user", userRouter);
    app.use("/api/owner", ownerRouter);
    app.use("/api/bookings", bookingRouter);

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1);
  }
};

startServer();
