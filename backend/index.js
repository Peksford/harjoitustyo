const Discogs = require('disconnect').Client;
// const app = express();
require('dotenv').config();
const { Sequelize, Model, DataTypes } = require('sequelize');
const express = require('express');
const cors = require('cors');
const app = express();
const middleware = require('./util/middleware');

const { PORT } = require('./util/config');
const { connectToDatabase } = require('./util/db');

const albumRouter = require('./controllers/albums');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');

app.use(cors());
app.use(express.json());

app.use('/api/albums', albumRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);

app.use(middleware.errorHandler);

const start = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();

// var db = new Discogs().database();
// db.getRelease(176126, function (err, data) {
//   console.log(data);
// });

// var dis = new Discogs({
//   consumerKey: process.env.CONSUMER_KEY,
//   consumerSecret: process.env.CONSUMER_SECRET,
// });

// const db = dis.database();

// console.log('test', dis.database());

// db.search('beatles - a hard days night', function (err, data) {
//   console.log(data.results[0]);
// });
