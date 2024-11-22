const logger = require('./logger');

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
  }
};

module.exports = {
  errorHandler,
};
