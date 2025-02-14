require('dotenv').config();
const axios = require('axios');
const express = require('express');
const router = express.Router();
const { Game, User } = require('../models');
const { tokenExtractor } = require('../util/middleware');

const CLIENT_ID = process.env.VITE_TWITCH_CLIENT_ID;
const CLIENT_SECRET = process.env.VITE_TWITCH_CLIENT_SECRET;
let accessToken = '';

const getAccessToken = async () => {
  try {
    const response = await axios.post(
      'https://id.twitch.tv/oauth2/token',
      null,
      {
        params: {
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          grant_type: 'client_credentials',
        },
      }
    );

    accessToken = response.data.access_token;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to search games' });
  }
};

router.get('/search-game', async (req, res) => {
  const { name } = req.query;

  try {
    if (!accessToken) await getAccessToken();

    const query = `
    search "${name}";
    fields id,name, genres.name, rating, cover.url, first_release_date, summary, involved_companies, url;
    limit 20;
    `;

    const response = await axios.post('https://api.igdb.com/v4/games', query, {
      headers: {
        'Client-ID': CLIENT_ID,
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error(error);
  }
});

router.get('/', async (req, res) => {
  const games = await Game.findAll({
    include: {
      model: User,
      attributes: ['username'],
    },
  });

  res.json(games);
});

router.post('/', tokenExtractor, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id);

    const game = await Game.create({
      ...req.body,
      user_id: user.id,
    });
    res.json(game);
  } catch (error) {
    next(error);
    // return res.status(400).json({ error });
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    // const user = await User.findByPk(req.decodedToken.id);
    const game = await Game.findByPk(req.params.id);
    res.json(game);
  } catch (error) {
    next(error);
    return res.status(400).json({ error });
  }
});

router.put('/:id', tokenExtractor, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id);
    const game = await Game.findByPk(req.params.id);

    if (game.user_id !== req.decodedToken.id) {
      return res
        .status(404)
        .json({ error: 'Not authorized to change the rating.' });
    }
    const { rating } = req.body;

    game.rating = rating;
    await game.save();
    res.json(game);
  } catch (error) {
    next(error);
  }
});

router.put('/heart/:id', tokenExtractor, async (req, res) => {
  try {
    const game = await Game.findByPk(req.params.id);
    const user = await User.findByPk(req.decodedToken.id);

    if (game.user_id !== req.decodedToken.id) {
      return res
        .status(404)
        .json({ error: 'Not authorized to change the heart.' });
    }
    await Game.update({ heart: false }, { where: { user_id: user.id } });
    await Game.update({ heart: true }, { where: { id: game.id } });

    const updatedGame = await Game.findByPk(req.params.id);

    res.json(updatedGame);
  } catch (error) {
    console.error('Error updating heart', error);
    res.status(500).json({ error: 'Failed updating heart' });
  }
});

router.delete('/:id', tokenExtractor, async (req, res, next) => {
  try {
    const game = await Game.findByPk(req.params.id);
    const user = await User.findByPk(req.decodedToken.id);

    await Game.destroy({
      where: { whole_title: game.whole_title, user_id: user.id },
    });

    res.status(204).send({ message: 'Game deleted' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
