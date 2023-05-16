require("dotenv").config();
require("./config/database").connect();

const express = require("express");
const user = require("./model/user");
const app = express();
const verifyToken = require("./middleware/auth");

app.use(express.json());

app.post("/register", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  if (!(firstName && lastName && email && password))
    return res.status(400).send("All fields are required.");
  const User = require("./model/user");
  const isUserExists = await User.findOne({ email });
  if (isUserExists)
    return res.status(409).send("User with this email already exists.");
  const bcrypt = require("bcryptjs");
  const HashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    firstName,
    lastName,
    email,
    password: HashedPassword,
  });
  const jwt = require("jsonwebtoken");
  const token = jwt.sign({ email, userId: user._id }, process.env.TOKEN_KEY, {
    expiresIn: "2h",
  });
  user.token = token;
  res.status(201).json(user);
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!(email && password))
    return res.status(401).send("All fields are require");
  const User = require("./model/user");
  const user = await User.findOne({ email });
  const bcrypt = require("bcryptjs");
  if (user && (await bcrypt.compare(password, user.password))) {
    const jwt = require("jsonwebtoken");
    const token = jwt.sign({ email, userId: user._id }, process.env.TOKEN_KEY, {
      expiresIn: "2h",
    });
    user.token = token;
    return res.status(200).json(user);
  } else {
    res.status(400, "Invalid credentials.");
  }
});
app.post("/welcome", verifyToken, (req, res) => {
  return res.status(200).send(req.user);
});

module.exports = app;
