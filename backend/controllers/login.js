const jwt = require('jsonwebtoken');
const router = require('express').Router();
const bcrypt = require('bcryptjs');

const { SECRET } = require('../util/config');
const User = require('../models/user');
const Session = require('../models/session');

router.post('/', async (request, response) => {
  const { username, password } = request.body;

  const user = await User.findOne({
    where: {
      username: username,
    },
  });

  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.password_hash);

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password',
    });
  }

  if (user.disabled) {
    await Session.update({ session: false }, { where: { userId: user.id } });

    return response.status(401).json({
      error: 'account disabled, please contact admin',
    });
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  };

  const token = jwt.sign(userForToken, SECRET);

  if (user && passwordCorrect) {
    const session = await Session.create({
      userId: user.id,
      token: token,
      username: user.username,
    });
  }

  response.status(200).send({
    token,
    username: user.username,
    name: user.name,
    id: user.id,
  });
});

module.exports = router;
