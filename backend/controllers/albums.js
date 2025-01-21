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

router.get('/:id', async (req, res, next) => {
  try {
    // const user = await User.findByPk(req.decodedToken.id);
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

    if (album.user_id !== req.decodedToken.id) {
      return res
        .status(404)
        .json({ error: 'Not authorized to change the rating.' });
    }
    const { rating } = req.body;

    console.log('ALBUM', rating);

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

    console.log('what is the user id', user);

    if (album.user_id !== req.decodedToken.id) {
      return res
        .status(404)
        .json({ error: 'Not authorized to change the heart.' });
    }
    await Album.update({ heart: false }, { where: { user_id: user.id } });
    await Album.update({ heart: true }, { where: { id: album.id } });

    const updatedAlbum = await Album.findByPk(req.params.id);

    res.json(updatedAlbum);
  } catch (error) {
    console.error('Error updating heart', error);
    res.status(500).json({ error: 'Failed updating heart' });
  }
});

module.exports = router;
