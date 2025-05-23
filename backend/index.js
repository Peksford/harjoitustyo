const Discogs = require('disconnect').Client;
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
const healthRouter = require('./controllers/health');
const groupRouter = require('./controllers/groups');
const commentRouter = require('./controllers/comments');
require('./cronjob');

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'dist')));

app.use('/api/health', healthRouter);
app.use('/api/albums', albumRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);
app.use('/api/logout', logoutRouter);
app.use('/api/books', booksRouter);
app.use('/api/movies', moviesRouter);
app.use('/api/games', gamesRouter);
app.use('/api/follow', followRouter);
app.use('/api/groups', groupRouter);
app.use('/api/comments', commentRouter);

if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing');
  console.log('Test starting');
  app.use('/api/testing', testingRouter);
}

app.use(middleware.errorHandler);
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const start = async () => {
  try {
    await connectToDatabase();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Error starting the server:', err);
    process.exit(1);
  }
};

start();
