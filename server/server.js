import path from "path";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Order from './models/Order.js';

// Setup __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(bodyParser.json());

// --- Database Connection (Mongoose) ---
const MONGO_URI = "mongodb://localhost:27017/Cael&Selene"; // IMPORTANT: Replace with your MongoDB connection string
mongoose.connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB successfully!"))
  .catch(err => console.error("Could not connect to MongoDB:", err));

// --- Mongoose Schemas ---
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

// --- JWT Secret ---
const JWT_SECRET = process.env.JWT_SECRET || "your_strong_jwt_secret_key"; // IMPORTANT: Use a strong, random key in production

// --- API Endpoints ---

// User Registration
app.post("/api/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ message: "User registered successfully!", token, userId: user._id });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(400).json({ message: "Registration failed. Email may already be in use." });
  }
});

// User Login
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password." });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password." });
    }
    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: "Login successful!", token, userId: user._id });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login." });
  }
});

// Add middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
};

// Checkout
app.post("/api/checkout", verifyToken, async (req, res) => {
  console.log('Received checkout request:', req.body);
  
  const { orderItems, shippingInfo } = req.body;
  
  try {
    if (!orderItems || !shippingInfo) {
      throw new Error('Missing required checkout information');
    }

    // Calculate order total
    const total = orderItems.reduce((sum, item) => 
      sum + (parseFloat(item.price) * parseInt(item.quantity)), 0
    );

    const newOrder = new Order({
      userId: req.user.userId,
      email: req.user.email,
      orderItems: orderItems.map(item => ({
        name: item.name,
        price: parseFloat(item.price),
        quantity: parseInt(item.quantity),
        size: item.size
      })),
      shippingInfo: {
        fullName: shippingInfo.fullName,
        address: shippingInfo.address,
        city: shippingInfo.city,
        state: shippingInfo.state,
        zip: shippingInfo.zip,
        phone: shippingInfo.phone,
        isGift: shippingInfo.isGift,
        giftMessage: shippingInfo.giftMessage
      },
      total: total,
      status: 'confirmed'
    });

    console.log('Attempting to save order:', newOrder);
    
    const savedOrder = await newOrder.save();
    console.log('Order saved successfully:', savedOrder);

    res.status(201).json({
      success: true,
      message: "Order placed successfully!",
      orderId: savedOrder._id,
      total: savedOrder.total
    });
  } catch (error) {
    console.error("Checkout error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to place order."
    });
  }
});

// Add this new endpoint for fetching order history
app.get("/api/orders", verifyToken, async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user.userId })
            .sort({ createdAt: -1 }); // Most recent first
        
        res.json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ message: "Failed to fetch orders" });
    }
});

// Health check first
app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

// Serve static files
app.use(express.static(path.join(__dirname, "../client")));

// Catch-all for frontend routes (avoids API paths)
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../client/luxury_clothing_website.html"));
});

app.use(express.static(path.join(__dirname, "../client")));

// Catch-all for frontend routes (avoids API paths)
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../client/luxury_clothing_website.html"));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
