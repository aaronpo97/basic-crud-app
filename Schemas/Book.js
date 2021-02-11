const mongoose = require('mongoose');
const { Schema } = mongoose;

const bookSchema = new Schema({
	title: String,
	genre: String,
	author: { type: Schema.Types.ObjectId, ref: 'Author' },
});

const Book = mongoose.model('Book', bookSchema);
module.exports = Book;
