const bcrypt = require('bcryptjs');
const router = require('express').Router();

const { User, Album, Book, Movie, Game, Follow } = require('../models');

router.get('/', async (req, res) => {
  const users = await User.findAll({
    attributes: ['id', 'username'],
    include: [
      {
        model: Album,
        attributes: { exclude: ['userId'] },
      },
      {
        model: Book,
        attributes: { exclude: ['userId'] },
      },
      {
        model: Movie,
        attributes: { exclude: ['userId'] },
      },
      {
        model: Game,
        attributes: { exclude: ['userId'] },
      },
      {
        model: Follow,
        as: 'followers',
        attributes: { exclude: ['userId'] },
      },
      {
        model: Follow,
        as: 'followed',
        attributes: { exclude: ['userId'] },
      },
    ],
  });
  res.json(users);
});

router.post('/', async (req, res, next) => {
  try {
    const { username, name, password } = req.body;

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
      attributes: ['name', 'username', 'id'],
      include: [
        {
          model: Album,
          attributes: {
            exclude: ['updatedAt', 'userId'],
          },
        },
        {
          model: Book,
          attributes: {
            exclude: ['updatedAt', 'userId'],
          },
        },
        {
          model: Movie,
          attributes: {
            exclude: ['updatedAt', 'userId'],
          },
        },
        {
          model: Game,
          attributes: {
            exclude: ['updatedAt', 'userId'],
          },
        },
        {
          model: Follow,
          as: 'followers',
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'userId'],
          },
        },
        {
          model: Follow,
          as: 'followed',
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
