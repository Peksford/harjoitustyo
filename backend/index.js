const Discogs = require('disconnect').Client;
// const app = express();
require('dotenv').config();
const { Sequelize, Model, DataTypes } = require('sequelize');
const path = require('path');
const express = require('express');
const cors = require('cors');
const app = express();
const middleware = require('./util/middleware');

const { PORT } = require('./util/config');
const { connectToDatabase } = require('./util/db');

const albumRouter = require('./controllers/albums');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const logoutRouter = require('./controllers/logout');
const booksRouter = require('./controllers/books');
const moviesRouter = require('./controllers/movies');
const gamesRouter = require('./controllers/games');
const followRouter = require('./controllers/follow');

app.use(cors());
app.use(express.json());
// app.use(express.static('dist'));
app.use(express.static(path.join(__dirname, 'dist')));

app.use('/api/albums', albumRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);
app.use('/api/logout', logoutRouter);
app.use('/api/books', booksRouter);
app.use('/api/movies', moviesRouter);
app.use('/api/games', gamesRouter);
app.use('/api/follow', followRouter);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing');
  console.log('ANYTHING HERE TEST');
  app.use('/api/testing', testingRouter);
}

app.use(middleware.errorHandler);

const start = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
