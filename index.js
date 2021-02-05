const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const Book = require('./Book.js');
const morgan = require('morgan');
morgan('tiny');
const app = express();

app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(cors());
app.use(morgan('tiny'));
app.use((req, res, next) => {
    console.log('This is my first middleware!');
    next(); //This calls on the next middleware!
});

const CONNECTION_URL = 'mongodb://localhost:27017/bookDB';

const PORT = process.env.PORT || 5000;

mongoose
    .connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() =>
        app.listen(PORT, () =>
            console.log(`Mongoose connection established. \nServer running on port ${PORT}`)
        )
    )
    .catch((error) => console.log(error.message));

// Create => post request
app.post('/index', async (req, res) => {
    const newBook = new Book(req.body);
    await newBook.save();
    await res.send(newBook);
});

// Read => get request

// full index
app.get('/index', async (req, res) => {
    const books = await Book.find();
    res.send(books);
});

// by id
app.get('/index/:id', async (req, res) => {
    const { id } = req.params;
    const book = await Book.findById(id);
    res.send(book);
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

app.use((req, res) => {
    res.status(404).send('Not found');
});

mongoose.set('useFindAndModify', false);
