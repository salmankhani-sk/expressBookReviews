const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Missing username or password" });
  }

  // Check if the username already exists
  if (users.some((user) => user.username === username)) {
    return res.status(400).json({ message: "Username already exists" });
  }

  // Register the user
  users.push({ username, password });
  console.log("Users after registration:", users); // Debug log

  return res.status(201).json({ message: "User Registered" });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here

  return res.status(200).json({books: books});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.status(200).json(book);
  }else {
  return res.status(404).json({message: "Book not found"});
}});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const booksByAuthor = Object.values(books).filter(book => book.author === author);
  if (booksByAuthor.length > 0) {
    return res.status(200).json(booksByAuthor);
  }else{
    return res.status(404).json({message: 'Author not found'});
  }
})
// Get all books based on title
public_users.get('/title/:title',function(req,res){
  const title = req.params.title;
  const booksBytitle = Object.values(books).filter(book => book.title === title);
  if (booksBytitle.length > 0){
    return res.status(200).json(booksBytitle);

  }else{
    return res.status(404).json({message: 'Title not found'});
  }
})

//  Get book review
// Get book review based on ISBN
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn; // Retrieve ISBN from request params
  const book = books[isbn]; // Fetch the book using the ISBN

  if (book) {
    if (Object.keys(book.reviews).length > 0) {
      return res.status(200).json(book.reviews); // Return reviews if they exist
    } else {
      return res.status(404).json({ message: "No reviews available for this book" });
    }
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});


module.exports.general = public_users;
