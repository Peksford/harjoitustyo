const bcrypt = require('bcrypt');
const router = require('express').Router();

const { User, Album, Book } = require('../models');

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: [
      {
        model: Album,
        attributes: { exclude: ['userId'] },
      },
      {
        model: Book,
        attributes: { exclude: ['userId'] },
      },
    ],
  });
  res.json(users);
});

router.post('/', async (req, res, next) => {
  try {
    const { username, name, password } = req.body;
    console.log('testing', password);

    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    const user = await User.create({
      username,
      name,
      password_hash,
    });

    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (error) {
    next(error);
  }
});

router.get('/:username', async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        username: req.params.username,
      },
      attributes: ['name', 'username'],
      include: [
        {
          model: Album,
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'userId'],
          },
        },
        {
          model: Book,
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
