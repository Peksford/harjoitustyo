const router = require('express').Router();

const User = require('../models/user');
const Session = require('../models/session');

router.delete('/', async (request, response, next) => {
  try {
    const username = request.headers.username;
    await Session.destroy({ where: { username } });

    response.status(204).send({ message: 'Logout succesful' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
