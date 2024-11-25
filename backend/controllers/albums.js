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

module.exports = router;
