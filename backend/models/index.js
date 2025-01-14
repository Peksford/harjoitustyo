const Album = require('./album');
const User = require('./user');
const Book = require('./book');
const Movie = require('./movie');
const Session = require('./session');

User.hasMany(Album, { foreignKey: 'user_id' });
Album.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(Book, { foreignKey: 'user_id' });
Book.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(Movie, { foreignKey: 'user_id' });
Movie.belongsTo(User, { foreignKey: 'user_id' });

Session.belongsTo(User);

module.exports = { Album, User, Session, Book, Movie };
