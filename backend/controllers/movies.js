const router = require('express').Router();
const { Movie, User } = require('../models');
const jwt = require('jsonwebtoken');
const { tokenExtractor } = require('../util/middleware');

router.get('/', async (req, res) => {
  const movies = await Movie.findAll({
    include: {
      model: User,
      attributes: ['username'],
    },
  });

  res.json(movies);
});

router.post('/', tokenExtractor, async (req, res, next) => {
  try {
    console.log('testinfg');
    const user = await User.findByPk(req.decodedToken.id);

    const movie = await Movie.create({
      ...req.body,
      user_id: user.id,
    });
    res.json(movie);
  } catch (error) {
    next(error);
    // return res.status(400).json({ error });
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    // const user = await User.findByPk(req.decodedToken.id);
    const movie = await Movie.findByPk(req.params.id);

    // console.log('user', user);
    // console.log('movie', movie);
    res.json(movie);
  } catch (error) {
    console.log(error);
    next(error);
    return res.status(400).json({ error });
  }
});

router.put('/:id', tokenExtractor, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id);
    const movie = await Movie.findByPk(req.params.id);

    if (movie.user_id !== req.decodedToken.id) {
      return res
        .status(404)
        .json({ error: 'Not authorized to change the rating.' });
    }
    const { rating } = req.body;

    console.log('ALBUM', rating);

    movie.rating = rating;
    await movie.save();
    res.json(movie);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
