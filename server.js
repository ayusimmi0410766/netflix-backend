const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connect
mongoose.connect("mongodb+srv://netflixUser:StrongPassword123@cluster0.1gn5ulz.mongodb.net/netflixDB?retryWrites=true&w=majority")

  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// User schema
const User = mongoose.model("User", {
  name: String,
  email: String,
  phone: String,
  password: String,
});

// Signup API
app.post("/signup", async (req, res) => {
  const { name, email, phone, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) return res.json({ message: "User already exists" });

  const hashed = await bcrypt.hash(password, 10);

  const user = new User({ name, email, phone, password: hashed });
  await user.save();

  res.json({ message: "Signup successful" });
});

// Login API
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.json({ message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.json({ message: "Wrong password" });

  res.json({ message: "Login success" });
});

// Server start
app.listen(5000, () => console.log("Server running on port 5000"));
