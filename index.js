const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const Book = require('./Schemas/Book.js');
const Author = require('./Schemas/Author');

const morgan = require('morgan');
morgan('tiny');
const app = express();

const AppError = require('./AppError');

app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(cors());
app.use(morgan('tiny'));
app.use((req, res, next) => {
	console.log('This is my first middleware!');
	next(); //This calls on the next middleware!
});

const CONNECTION_URL = 'mongodb://localhost:27017/books';

const PORT = process.env.PORT || 5000;

mongoose
	.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() =>
		app.listen(PORT, () => console.log(`Mongoose connection established. \nServer running on port ${PORT}`))
	)
	.catch((error) => console.log(error.message));

// Create => author
app.post('/authors', async (req, res, next) => {
	try {
		console.log(req.body);
		const newAuthor = new Author(req.body);
		await newAuthor.save();
		await res.send(newAuthor);
	} catch (error) {
		next(error);
	}
});

// creating a new book for authors

app.post('/authors/:id', async (req, res, next) => {
	try {
		const { id } = req.params;
		const author = await Author.findById(id);
		const newBook = await new Book(req.body);

		newBook.author = author;
		author.books.push(newBook);
		await newBook.save();
		await author.save();

		res.send(newBook);
	} catch (error) {
		next(error);
	}
});

// Read => get request

//index of books
app.get('/books', async (req, res) => {
	const books = await Book.find();
	res.send(books);
});

// books by id
app.get('/books/:id', async (req, res, next) => {
	try {
		const { id } = req.params;
		const book = await Book.findById(id);
		res.send(book);
	} catch (error) {
		next(error);
	}
});

//index of authors
app.get('/authors', async (req, res) => {
	const authors = await Author.find();
	res.send(authors);
});

//author by id

app.get('/author/:id', async (req, res, next) => {
	try {
		const { id } = req.params;
		const author = await Author.findById(id);
		res.send(author);
	} catch (error) {
		next(error);
	}
});

// random id
app.get('/random', async (req, res) => {
	const books = await Book.find();
	const i = Math.floor(Math.random() * books.length);
	console.log(i);
	res.send(books[i]);
});

// Update => patch request
app.patch('/index/:id', async (req, res) => {
	const { id } = req.params;
	const bookToUpdate = await Book.findByIdAndUpdate(id, req.body, {
		runValidators: true,
		new: true,
	});
	const updatedBook = await Book.findById(id);

	await res.redirect(`${id}`);
});

// Delete => delete request

app.delete('/index/:id', async (req, res) => {
	const { id } = req.params;
	const deletedBook = await Book.findByIdAndDelete(id);
	await res.send(`${deletedBook.title} has been deleted.`);
});

app.get('/error', async (req, res) => {
	throw new AppError('Not allowed', '401');
});

// Basic 404 message if resource not found

app.use((req, res) => {
	res.status(404).send('Not found');
});

app.use((err, req, res, next) => {
	const { status = 500, message = 'Something went wrong' } = err;
	res.status(status).send(message);
});

mongoose.set('useFindAndModify', false);
