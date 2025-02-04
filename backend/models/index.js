const Album = require('./album');
const User = require('./user');
const Book = require('./book');
const Movie = require('./movie');
const Game = require('./game');
const Session = require('./session');
const Follow = require('./follow');

User.hasMany(Album, { foreignKey: 'user_id' });
Album.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(Book, { foreignKey: 'user_id' });
Book.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(Movie, { foreignKey: 'user_id' });
Movie.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(Game, { foreignKey: 'user_id' });
Game.belongsTo(User, { foreignKey: 'user_id' });

Session.belongsTo(User);

Follow.belongsTo(User, { foreignKey: 'followerId', as: 'follower' });
Follow.belongsTo(User, { foreignKey: 'followedId', as: 'followed' });

User.hasMany(Follow, { foreignKey: 'followedId', as: 'followers' });
User.hasMany(Follow, { foreignKey: 'followerId', as: 'followed' });

module.exports = { Album, User, Session, Book, Movie, Game, Follow };
