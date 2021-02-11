const mongoose = require('mongoose');
const { Schema } = mongoose;

const authorSchema = new Schema({
	first: String,
	last: String,
	books: [{ type: Schema.Types.ObjectId, ref: 'Book' }],
});

const Author = mongoose.model('Author', authorSchema);
module.exports = Author;
