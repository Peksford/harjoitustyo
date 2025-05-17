const router = require('express').Router();
const Album = require('../models/album');
const Movie = require('../models/movie');
const Book = require('../models/book');
const Game = require('../models/game');
const User = require('../models/user');
const Session = require('../models/session');

router.post('/reset', async (request, response) => {
  const user = await User.findOne({ where: { username: 'kayttaja' } });

  if (!user) {
    return response.status(400).json({ error: 'User not found' });
  }

  await Album.destroy({ where: { user_id: user.id } });
  await Movie.destroy({ where: { user_id: user.id } });
  await Book.destroy({ where: { user_id: user.id } });
  await Game.destroy({ where: { user_id: user.id } });

  await Session.destroy({ where: { username: 'kayttaja' } });

  await User.destroy({ where: { id: user.id } });

  response.status(204).end();
});

module.exports = router;
