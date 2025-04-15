const bcrypt = require('bcryptjs');
const router = require('express').Router();
const { User, Album, Book, Movie, Game, Follow } = require('../models');
const { tokenExtractor } = require('../util/middleware');
const { Op } = require('sequelize');

router.get('/test', (req, res) => {
  res.send('Test route works!');
});

router.get('/', async (req, res, next) => {
  try {
    let { page = 1, limit = 2 } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);
    const offset = (page - 1) * limit;

    const users = await User.findAndCountAll({
      attributes: ['id', 'username'],
      limit,
      offset,
      // include: [
      //   {
      //     model: Album,
      //     attributes: { exclude: ['userId'] },
      //   },
      //   {
      //     model: Book,
      //     attributes: { exclude: ['userId'] },
      //   },
      //   {
      //     model: Movie,
      //     attributes: { exclude: ['userId'] },
      //   },
      //   {
      //     model: Game,
      //     attributes: { exclude: ['userId'] },
      //   },
      //   {
      //     model: Follow,
      //     as: 'followers',
      //     attributes: { exclude: ['userId'] },
      //   },
      //   {
      //     model: Follow,
      //     as: 'followed',
      //     attributes: { exclude: ['userId'] },
      //   },
      // ],
      // order: [['createdAt', 'DESC']],
    });
    res.json({
      totalUsers: users.count,
      totalPages: Math.ceil(users.count / limit),
      currentPage: page,
      users: users.rows,
    });
  } catch (error) {
    next(error);
  }
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

    const followedUsers = await User.findAll({
      attributes: ['name', 'username', 'id'],
      include: [
        {
          model: Follow,
          as: 'followers',
          where: { follower_id: user.id },
          attributes: [],
        },
      ],
    });

    const userIds = followedUsers.map((u) => u.id);

    const albums = await Album.findAll({
      where: {
        user_id: { [Op.in]: userIds },
        [Op.or]: [
          { createdAt: { [Op.gte]: oneWeek } },
          // { updatedAt: { [Op.gte]: oneWeek } },
        ],
      },
      order: [['createdAt', 'DESC']],
    });

    const books = await Book.findAll({
      where: {
        user_id: { [Op.in]: userIds },
        [Op.or]: [
          { createdAt: { [Op.gte]: oneWeek } },
          // { updatedAt: { [Op.gte]: oneWeek } },
        ],
      },
      order: [['createdAt', 'DESC']],
    });

    const movies = await Movie.findAll({
      where: {
        user_id: { [Op.in]: userIds },
        [Op.or]: [
          { createdAt: { [Op.gte]: oneWeek } },
          // { updatedAt: { [Op.gte]: oneWeek } },
        ],
      },
      order: [['createdAt', 'DESC']],
    });

    const games = await Game.findAll({
      where: {
        user_id: { [Op.in]: userIds },
        [Op.or]: [
          { createdAt: { [Op.gte]: oneWeek } },
          // { updatedAt: { [Op.gte]: oneWeek } },
        ],
      },
      order: [['createdAt', 'DESC']],
    });

    res.json({
      followedUsers,
      albums,
      books,
      movies,
      games,
    });
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
      const groups = await user.getGroups({
        include: [
          {
            model: User,
            as: 'members',
            attributes: ['id', 'username'],
          },
        ],
      });

      res.json({
        ...user.toJSON(),
        albums,
        books,
        movies,
        games,
        followers,
        followed,
        groups,
      });
    } else {
      res.status(404).end();
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
