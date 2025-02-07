const logger = require('./logger');
const jwt = require('jsonwebtoken');

const { User, Session } = require('../models');
const { SECRET } = require('../util/config');

const errorHandler = (error, request, response, next) => {
  console.log('ERROR: ', error);
  if (error.name === 'SequelizeValidationError') {
    logger.error(error);
    return response.status(400).send({ error: error.message });
  } else if (error.name === 'TypeError') {
    logger.error(error);
    return response.status(400).send({ error: error.message });
  } else if (error.name === 'SequelizeForeignKeyConstraintError') {
    logger.error(error);
    return response.status(400).send({ error: error.message });
  } else if (error.name === 'SequelizeDatabaseError') {
    logger.error(error);
    return response.status(400).send({ error: error.message });
  } else if (error.name === 'SequelizeUniqueConstraintError') {
    logger.error(error);
    return response.status(400).send({ error: error.message });
  }
};

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get('authorization');

  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      console.log(authorization.substring(7));
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET);

      const user = await User.findOne({
        where: {
          id: req.decodedToken.id,
        },
      });

      if (!user) {
        return res.status(401).json({
          error: 'User not found',
        });
      }

      if (user.disabled) {
        await Session.update(
          { session: false },
          { where: { userId: user.id } }
        );

        return res.status(401).json({
          error: 'account disabled, please contact admin',
        });
      }
      const sessionActive = await Session.findOne({
        where: {
          userId: req.decodedToken.id,
          token: authorization.substring(7),
          session: true,
          username: req.decodedToken.username,
        },
      });

      if (!sessionActive) {
        return res.status(401).json({ error: 'Session invalid' });
      }
    } catch (error) {
      console.log(error);
      return res.status(401).json({ error: error.message });
    }
  } else {
    return res.status(401).json({ error: 'token missing' });
  }
  next();
};

module.exports = {
  errorHandler,
  tokenExtractor,
};
