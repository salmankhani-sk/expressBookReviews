const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = []; // Store users as an array of objects

// Check if the username is valid (not already taken)
const isValid = (username) => {
  return !users.some((user) => user.username === username);
};

// Authenticate a user by username and password
const authenticatedUser = (username, password) => {
  const user = users.find((user) => user.username === username);
  return user && user.password === password;
};

// Only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  console.log("Users during login:", users); // Debug log

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  const token = jwt.sign({ username }, "fingerprint_customer", { expiresIn: "1h" });
  return res.status(200).json({ message: "Login successful", token });
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
