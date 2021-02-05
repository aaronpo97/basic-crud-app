const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: String,
    author: String,
    isbn: Number,
    isbn13: Number,
    year: Number,
    category: String,
    numPages: Number,
    publisher: String,
    description: String,
});
const Book = mongoose.model('Book', bookSchema);
module.exports = Book;
