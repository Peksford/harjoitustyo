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

router.get('/:id', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ['name', 'username'],
      include: [
        {
          model: Album,
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'userId'],
          },
        },
      ],
    });
    if (user) {
      res.json(user);
    } else {
      res.status(404).end();
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
