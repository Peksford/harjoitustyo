const cron = require('node-cron');
const { Album, Book, Movie, Game } = require('./models');

cron.schedule(
  '*/1 * * * *',
  async () => {
    try {
      console.log('Setting up cronjob...');
      await Album.update({ heart: false }, { where: {} });
      await Book.update({ heart: false }, { where: {} });
      await Movie.update({ heart: false }, { where: {} });
      await Game.update({ heart: false }, { where: {} });
    } catch (error) {
      console.error('Error with heart cronjob');
    }
  },
  {
    timezone: 'Europe/Helsinki',
  }
);
