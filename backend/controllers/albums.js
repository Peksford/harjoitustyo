const router = require('express').Router();
const { Album } = require('../models');

router.get('/', async (req, res) => {
  const albums = await Album.findAll({});

  res.json(albums);
});

router.post('/', async (req, res, next) => {
  try {
    const album = await Album.create({
      ...req.body,
      userId: 2,
    });
    res.json(album);
  } catch (error) {
    next(error);
    // return res.status(400).json({ error });
  }
});

module.exports = router;
