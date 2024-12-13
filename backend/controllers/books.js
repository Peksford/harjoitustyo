const axios = require('axios');
const { Book, User } = require('../models');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { tokenExtractor } = require('../util/middleware');

router.get('/search-book', async (req, res) => {
  const { name } = req.query;
  const userAgent = 'RateApp (jonksu4@hotmail.com)';
  console.log('searching', name);
  try {
    const response = await axios.get('https://openlibrary.org/search.json', {
      headers: {
        'User-Agent': userAgent,
      },
      params: {
        q: name,
        page: 1,
        limit: 10,
      },
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

    // console.log('user', user);
    // console.log('album', album);
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

    console.log('BOOK', rating);

    book.rating = rating;
    await book.save();
    res.json(book);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
