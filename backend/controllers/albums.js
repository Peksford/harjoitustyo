const router = require('express').Router();
const { Album, User } = require('../models');
const jwt = require('jsonwebtoken');
const { tokenExtractor } = require('../util/middleware');

router.get('/', async (req, res) => {
  const albums = await Album.findAll({
    include: {
      model: User,
      attributes: ['username'],
    },
  });

  res.json(albums);
});

router.post('/', tokenExtractor, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id);
    const album = await Album.create({
      ...req.body,
      user_id: user.id,
    });
    res.json(album);
  } catch (error) {
    next(error);
    // return res.status(400).json({ error });
  }
});

router.get('/:id', tokenExtractor, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id);
    const album = await Album.findByPk(req.params.id);

    // console.log('user', user);
    // console.log('album', album);
    res.json(album);
  } catch (error) {
    console.log(error);
    next(error);
    return res.status(400).json({ error });
  }
});

router.put('/:id', tokenExtractor, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id);
    const album = await Album.findByPk(req.params.id);
    const { rating } = req.body;

    console.log('ALBUM', rating);

    album.rating = rating;
    await album.save();
    res.json(album);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
