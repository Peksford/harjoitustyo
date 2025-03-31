const cron = require('node-cron');
const { Album, Book, Movie, Game } = require('./models');

if (process.env.NODE_ENV !== 'test') {
  console.log('Setting up cronjob...');
  cron.schedule(
    '0 0 * * MON',
    async () => {
      try {
        console.log('Cron job running...');
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
}
