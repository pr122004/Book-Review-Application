const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required!" });
  }

  const userExists = users.find(user => user.username === username);

  if (userExists) {
    return res.status(400).json({ message: "Username already exists!" });
  }

  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully!" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4)); // Pretty printed
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.status(200).send(JSON.stringify(book, null, 4));
  } else {
    return res.status(404).send({ message: "Book not found!" });
  }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const matchingBooks = [];

  for (const isbn in books) {
    if (books[isbn].author === author) {
      matchingBooks.push(books[isbn]);
    }
  }

  if (matchingBooks.length > 0) {
    return res.status(200).send(JSON.stringify(matchingBooks, null, 4));
  } else {
    return res.status(404).send({ message: "No books found by this author!" });
  }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const matchingBooks = [];

  for (const isbn in books) {
    if (books[isbn].title === title) {
      matchingBooks.push(books[isbn]);
    }
  }

  if (matchingBooks.length > 0) {
    return res.status(200).send(JSON.stringify(matchingBooks, null, 4));
  } else {
    return res.status(404).send({ message: "No books found with this title!" });
  }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book && book.reviews) {
    return res.status(200).send(JSON.stringify(book.reviews, null, 4));
  } else {
    return res.status(404).send({ message: "No reviews found for this book!" });
  }
});

module.exports.general = public_users;
