const axios = require('axios');
const { Book, User } = require('../models');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { tokenExtractor } = require('../util/middleware');

router.get('/search-book', async (req, res) => {
  const { name, title, author, language, subject, isbn } = req.query;
  const userAgent = 'RateApp (jonksu4@hotmail.com)';

  try {
    const params = {
      limit: 50,
      sort: 'editions',
    };
    if (name) params.q = name;
    if (title) params.title = title;
    if (author) params.author = author;
    if (language) params.language = language;
    if (isbn) params.isbn = isbn;
    if (subject) params.subject = subject;
    const response = await axios.get('https://openlibrary.org/search.json', {
      headers: {
        'User-Agent': userAgent,
      },
      params,
    });

    res.json(response.data);
  } catch (error) {
    console.error(error);
  }
});

router.get('/', async (req, res) => {
  const books = await Book.findAll({
    include: {
      model: User,
      attributes: ['username'],
    },
  });

  res.json(books);
});

router.post('/', tokenExtractor, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id);
    const book = await Book.create({
      ...req.body,
      user_id: user.id,
    });
    res.json(book);
  } catch (error) {
    next(error);
    // return res.status(400).json({ error });
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    // const user = await User.findByPk(req.decodedToken.id);
    const book = await Book.findByPk(req.params.id);

    res.json(book);
  } catch (error) {
    console.log(error);
    next(error);
    return res.status(400).json({ error });
  }
});

router.put('/:id', tokenExtractor, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id);
    const book = await Book.findByPk(req.params.id);

    if (book.user_id !== req.decodedToken.id) {
      return res
        .status(404)
        .json({ error: 'Not authorized to change the rating.' });
    }
    const { rating } = req.body;

    book.rating = rating;
    await book.save();
    res.json(book);
  } catch (error) {
    next(error);
  }
});

router.put('/heart/:id', tokenExtractor, async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    const user = await User.findByPk(req.decodedToken.id);

    if (book.user_id !== req.decodedToken.id) {
      return res
        .status(404)
        .json({ error: 'Not authorized to change the heart.' });
    }
    await Book.update({ heart: false }, { where: { user_id: user.id } });
    await Book.update({ heart: true }, { where: { id: book.id } });

    const updatedBook = await Book.findByPk(req.params.id);

    res.json(updatedBook);
  } catch (error) {
    console.error('Error updating heart', error);
    res.status(500).json({ error: 'Failed updating heart' });
  }
});

router.delete('/:id', tokenExtractor, async (req, res, next) => {
  try {
    const book = await Book.findByPk(req.params.id);
    const user = await User.findByPk(req.decodedToken.id);

    await Book.destroy({
      where: { whole_title: book.whole_title, user_id: user.id },
    });

    res.status(204).send({ message: 'Book deleted' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
