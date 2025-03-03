const bcrypt = require('bcryptjs');
const router = require('express').Router();
const { User, Album, Book, Movie, Game, Follow } = require('../models');
const { tokenExtractor } = require('../util/middleware');
const { Op } = require('sequelize');

router.get('/test', (req, res) => {
  res.send('Test route works!');
});

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

router.get('/following', tokenExtractor, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id);

    const oneWeek = new Date();
    oneWeek.setDate(oneWeek.getDate() - 5);

    const followers = await User.findAll({
      attributes: ['name', 'username', 'id'],
      include: [
        {
          model: Album,
          attributes: { exclude: ['userId'] },
          where: {
            [Op.or]: [
              { createdAt: { [Op.gte]: oneWeek } },
              { updatedAt: { [Op.gte]: oneWeek } },
            ],
          },
          required: false,
        },
        {
          model: Book,
          attributes: { exclude: ['userId'] },
          where: {
            [Op.or]: [
              { createdAt: { [Op.gte]: oneWeek } },
              { updatedAt: { [Op.gte]: oneWeek } },
            ],
          },
          required: false,
        },
        {
          model: Movie,
          attributes: { exclude: ['userId'] },
          where: {
            [Op.or]: [
              { createdAt: { [Op.gte]: oneWeek } },
              { updatedAt: { [Op.gte]: oneWeek } },
            ],
          },
          required: false,
        },
        {
          model: Game,
          attributes: { exclude: ['userId'] },
          where: {
            [Op.or]: [
              { createdAt: { [Op.gte]: oneWeek } },
              { updatedAt: { [Op.gte]: oneWeek } },
            ],
          },
          required: false,
        },
        {
          model: Follow,
          as: 'followers',
          where: { follower_id: user.id },
          attributes: [],
        },
        // {
        //   model: Follow,
        //   as: 'followed',
        //   where: { follower_id: user.id },
        //   attributes: { exclude: ['createdAt', 'updatedAt', 'userId'] },
        // },
      ],
      order: [
        [Album, 'updatedAt', 'DESC'],
        [Book, 'updatedAt', 'DESC'],
        [Movie, 'updatedAt', 'DESC'],
        [Game, 'updatedAt', 'DESC'],
      ],
    });
    res.json(followers);
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
    });

    if (user) {
      const albums = await user.getAlbums({
        order: [['createdAt', 'DESC']],
      });
      const books = await user.getBooks({
        order: [['createdAt', 'DESC']],
      });
      const movies = await user.getMovies({
        order: [['createdAt', 'DESC']],
      });
      const games = await user.getGames({
        order: [['createdAt', 'DESC']],
      });
      const followers = await user.getFollowers();
      const followed = await user.getFollowed();

      res.json({
        ...user.toJSON(),
        albums,
        books,
        movies,
        games,
        followers,
        followed,
      });
    } else {
      res.status(404).end();
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
