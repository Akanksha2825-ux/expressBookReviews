const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  // Validate input fields
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  // Check if the username already exists
  if (users[username]) {
    return res.status(400).json({ message: "Username already exists." });
  }

  // Add the new user to the users object
  users[username] = { password: password };

  return res.status(201).json({ message: `User ${username} registered successfully.` });
});

// Get the list of books available in the shop
public_users.get('/', function (req, res) {
  return res.json(books);  // Use JSON.stringify for pretty-printing
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = Object.values(books).find(b => b.isbn === isbn);
  
  if (!book) {
    return res.status(404).json({ message: "Book not found." });
  }

  return res.json(book);
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const booksByAuthor =Object.values(books).filter(b => b.author.toLowerCase() === author.toLowerCase());

  if (booksByAuthor.length === 0) {
    return res.status(404).json({ message: "No books found by this author." });
  }

  return res.json(booksByAuthor);
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const booksByTitle = Object.values(books).filter(b => b.title.toLowerCase().includes(title.toLowerCase()));

  if (booksByTitle.length === 0) {
    return res.status(404).json({ message: "No books found with this title." });
  }

  return res.json(booksByTitle);
});

// Get book reviews based on ISBN
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = Object.values(books).find(b => b.isbn === isbn);

  if (!book) {
    return res.status(404).json({ message: "Book not found." });
  }

  if (!book.reviews || Object.keys(book.reviews).length === 0) {
    return res.json({ message: "No reviews found for this book." });
  }

  return res.json(book.reviews);
});

module.exports.general = public_users;
