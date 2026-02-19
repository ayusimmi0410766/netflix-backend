const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(
  "YOUR_MONGODB_CONNECTION_STRING"
).then(() => console.log("MongoDB Connected"));

const UserSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  password: String,
});

const User = mongoose.model("User", UserSchema);

// Signup
app.post("/signup", async (req, res) => {
  const { name, phone, email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: "User already exists" });

  const hashed = await bcrypt.hash(password, 10);

  await User.create({ name, phone, email, password: hashed });

  res.json({ message: "Signup successful" });
});

// Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "User not found" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: "Wrong password" });

  res.json({ message: "Login success" });
});

app.listen(5000, () => console.log("Server running on port 5000"));
