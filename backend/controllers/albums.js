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
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const album = await Album.findByPk(req.params.id);

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

    if (album.user_id !== req.decodedToken.id) {
      return res
        .status(404)
        .json({ error: 'Not authorized to change the rating.' });
    }
    const { rating } = req.body;

    album.rating = rating;
    await album.save();
    res.json(album);
  } catch (error) {
    next(error);
  }
});

router.put('/heart/:id', tokenExtractor, async (req, res) => {
  try {
    const album = await Album.findByPk(req.params.id);
    const user = await User.findByPk(req.decodedToken.id);

    const getWeekNumber = (date = new Date()) => {
      const oneJan = new Date(date.getFullYear(), 0, 1);
      const numberOfDays = Math.floor((date - oneJan) / (24 * 60 * 60 * 1000));
      return Math.ceil((numberOfDays + oneJan.getDay() + 1) / 7);
    };

    if (album.user_id !== req.decodedToken.id) {
      return res
        .status(404)
        .json({ error: 'Not authorized to change the heart.' });
    }
    await Album.update({ heart: false }, { where: { user_id: user.id } });
    await Album.update(
      {
        heart: true,
        pick_of_the_week: [new Date().getFullYear(), getWeekNumber()],
      },
      { where: { id: album.id } }
    );

    const updatedAlbum = await Album.findByPk(req.params.id);

    res.json(updatedAlbum);
  } catch (error) {
    console.error('Error updating heart', error);
    res.status(500).json({ error: 'Failed updating heart' });
  }
});

router.delete('/:id', tokenExtractor, async (req, res, next) => {
  try {
    const album = await Album.findByPk(req.params.id);
    const user = await User.findByPk(req.decodedToken.id);

    await Album.destroy({
      where: { whole_title: album.whole_title, user_id: user.id },
    });

    res.status(204).send({ message: 'Album deleted' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
