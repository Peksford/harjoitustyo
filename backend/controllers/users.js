const router = require('express').Router();

const { User, Album } = require('../models');

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Album,
      attributes: { exclude: ['userId'] },
    },
  });
  res.json(users);
});

router.post('/', async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    res.json(user);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
