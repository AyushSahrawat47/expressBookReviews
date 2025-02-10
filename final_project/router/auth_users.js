const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  return users.some(user => user.username === username);
}

const authenticatedUser = (username, password) => {
  const user = users.find(user => user.username === username && user.password === password);
  return user !== undefined;
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  const token = jwt.sign({ username }, 'your_jwt_secret_key', { expiresIn: '1h' });

  return res.status(200).json({ message: "Login successful", token });

  return res.status(300).json({ message: "Yet to be implemented" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { review } = req.body;
  const { username } = req.user; // Assuming authentication middleware adds `req.user`

  if (!isbn || !review) {
    return res.status(400).json({ message: "ISBN and review are required" });
  }

  // Find the book by ISBN (since books are stored with numeric keys)
  let bookKey = Object.keys(books).find(key => books[key].isbn == isbn);

  if (!bookKey) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Ensure reviews exist
  if (!books[bookKey].reviews) {
    books[bookKey].reviews = {};
  }

  // Add or update the review
  books[bookKey].reviews[username] = review;

  return res.status(200).json({ message: "Review added/updated successfully" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
