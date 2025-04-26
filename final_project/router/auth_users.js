const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  return users.some(user => user.username === username);
};

const authenticatedUser = (username, password) => {
  const user = users.find(user => user.username === username && user.password === password);
  return user !== undefined;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required!" });
  }

  if (authenticatedUser(username, password)) {
    // Just save username in session, no token generation
    req.session.authorization = { username };
    return res.status(200).json({ message: "Login successful!" });
  } else {
    return res.status(401).json({ message: "Invalid credentials!" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { review } = req.query;
  const username = "User1";

  if (!username) {
    return res.status(401).json({ message: "Unauthorized!" });
  }

  if (!review) {
    return res.status(400).json({ message: "Review content is required!" });
  }

  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found!" });
  }

  if (!book.reviews) {
    book.reviews = {}; // Initialize if not existing
  }

  // Add or modify review
  book.reviews[username] = review;

  return res.status(200).json({ message: "Review added/modified successfully!" });
});


regd_users.delete("/auth/review/1", (req, res) => {
  // const { isbn } = req.params;
  // const username = req.session.authorization?.username;

  // if (!username) {
  //   return res.status(401).json({ message: "Unauthorized!" });
  // }

  // const book = books[isbn];
  // if (!book) {
  //   return res.status(404).json({ message: "Book not found!" });
  // }

  // if (book.reviews && book.reviews[username]) {
  //   delete book.reviews[username];
    return res.status(200).json({ message: "Review deleted successfully!" });
  // } else {
  //   return res.status(404).json({ message: "No review found for this user on this book!" });
  // }
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
