import User from "../models/User.js";
import bcrypt, { hash } from "bcrypt";
import jwt from "jsonwebtoken";
import Car from "../models/Car.js";

// Generate JWT Token
const generateToken = (userId) => {
  const payload = userId;
  return jwt.sign(payload, process.env.JWT_SECRET);
};

// Register User
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password || password.length < 8) {
      return res
        .status(400)
        .json({ success: false, message: "Fill all the fields" });
    }

    // Validate email contains '@' and ends with '.com'
    if (
      typeof email !== "string" ||
      !email.includes("@") ||
      !email.endsWith(".com")
    ) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email. Must include "@" and end with ".com"',
      });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res
        .status(409)
        .json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });
    const token = generateToken(user._id.toString());

    res.status(201).json({ success: true, token });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Login User
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid Credentials" });
    }

    const token = generateToken(user._id.toString());
    res.status(200).json({ success: true, token });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get User data using Token (JWT)
export const getUserData = async (req, res) => {
  try {
    const { user } = req;
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all cars for the frontend
export const getCars = async (req, res) => {
  try {
    // Query params for filtering, sorting and pagination
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
      category,
      location,
      minPrice,
      maxPrice,
      brand,
      q,
    } = req.query;

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const perPage = Math.max(parseInt(limit, 10) || 10, 1);

    const filter = { isAvailable: true };
    if (category) filter.category = new RegExp(`^${category}$`, "i");
    if (location) filter.location = location;
    if (brand) filter.brand = brand;
    // add text search across brand, model and category if q provided
    if (q) {
      const regex = new RegExp(q, "i");
      filter.$or = [{ brand: regex }, { model: regex }, { category: regex }];
    }
    if (minPrice || maxPrice) {
      filter.pricePerDay = {};
      if (minPrice) filter.pricePerDay.$gte = parseFloat(minPrice);
      if (maxPrice) filter.pricePerDay.$lte = parseFloat(maxPrice);
    }

    const sort = {};
    const order = sortOrder === "asc" ? 1 : -1;
    sort[sortBy] = order;

    const total = await Car.countDocuments(filter);
    const cars = await Car.find(filter)
      .sort(sort)
      .skip((pageNum - 1) * perPage)
      .limit(perPage);

    res.status(200).json({
      success: true,
      cars,
      pagination: {
        total,
        page: pageNum,
        limit: perPage,
        totalPages: Math.ceil(total / perPage),
      },
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
