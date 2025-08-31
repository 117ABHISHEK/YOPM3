import path from "path";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Setup __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// --- Database Connection (Mongoose) ---
const MONGO_URI = "mongodb://localhost:27017/luxury-brand-db"; // IMPORTANT: Replace with your MongoDB connection string
mongoose.connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB successfully!"))
  .catch(err => console.error("Could not connect to MongoDB:", err));

// --- Mongoose Schemas ---
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  email: { type: String, required: true },
  orderItems: { type: [Object], required: true },
  shippingInfo: { type: Object, required: true },
  paymentInfo: { type: Object, required: false },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model("User", userSchema);
const Order = mongoose.model("Order", orderSchema);

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

// Checkout
app.post("/api/checkout", async (req, res) => {
  const { orderItems, shippingInfo, paymentInfo, userEmail, userId } = req.body;
  try {
    const newOrder = new Order({
      userId: userId || null,
      email: userEmail,
      orderItems,
      shippingInfo,
      paymentInfo
    });
    await newOrder.save();
    res.status(201).json({ message: "Order placed successfully!", orderId: newOrder._id });
  } catch (error) {
    console.error("Checkout error:", error);
    res.status(500).json({ message: "Failed to place order." });
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

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
