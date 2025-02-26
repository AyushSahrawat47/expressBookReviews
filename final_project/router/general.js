const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  if (isValid(username)) {
    return res.status(400).json({ message: "Username already exists" });
  }
  users.push({ username, password });
  return res.status(200).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  try{
    return res.status(200).json(books);
  }
  catch(err){
    return res.status(500).json({message: "Internal server error"});

  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
 const {isbn} = req.params;
 const book = Object.values(books).find(book => book.isbn == isbn);
  if (book) {
    return res.status(200).json(book);
  }else{
    return res.status(404).json({message: "No book found for this ISBN"});
  }
 });
  
 public_users.get('/author/:author', function (req, res) {
  const { author } = req.params;
  const booksByAuthor = Object.values(books).filter(book => book.author === author);

  if (booksByAuthor.length > 0) {
    return res.status(200).json(booksByAuthor);
  } else {
    return res.status(404).json({ message: "No books found for this author" });
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const {title} = req.params;
  const booksByTitle = Object.values(books).filter(book => book.title === title);

  if (booksByTitle.length > 0) {
    return res.status(200).json(booksByTitle);
  }else{
    return res.status(404).json({message: "No books found for this title"});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const {isbn}= req.params;
  const review = Object.values(books).find(book => book.isbn == isbn).reviews;
  if (review) {
    return res.status(200).json(review);
  }else{
    return res.status(404).json({message: "No reviews found for this book"});
  }
});

module.exports.general = public_users;
