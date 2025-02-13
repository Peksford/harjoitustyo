import React from 'react';
import { useState } from 'react';
import AlbumSearch from './AlbumSearch';
import MovieSearch from './MovieSearch';
import BookSearch from './BookSearch';
import GameSearch from './GameSearch';
import UserSearch from './UserSearch';
import PropTypes from 'prop-types';

const Search = ({ createAlbum, createBook, createMovie, createGame }) => {
  const [type, setType] = useState('albums');

  const handleTypeChange = (event) => {
    setType(event.target.value);
  };

  return (
    <div>
      <div className="radio-group">
        <label style={{ marginRight: '10px' }}>
          <input
            type="radio"
            value="albums"
            data-testid="album"
            checked={type === 'albums'}
            onChange={handleTypeChange}
          />{' '}
          Albums
        </label>
        <label style={{ marginRight: '10px' }}>
          <input
            type="radio"
            value="movies"
            data-testid="movie"
            checked={type === 'movies'}
            onChange={handleTypeChange}
          />{' '}
          Movies
        </label>
        <label style={{ marginRight: '10px' }}>
          <input
            type="radio"
            value="books"
            data-testid="book"
            checked={type === 'books'}
            onChange={handleTypeChange}
          />{' '}
          Books
        </label>
        <label style={{ marginRight: '10px' }}>
          <input
            type="radio"
            value="games"
            data-testid="game"
            checked={type === 'games'}
            onChange={handleTypeChange}
          />{' '}
          Games{' '}
        </label>
        <label style={{ marginRight: '10px' }}>
          <input
            type="radio"
            value="users"
            data-testid="user"
            checked={type === 'users'}
            onChange={handleTypeChange}
          />{' '}
          User
        </label>
      </div>
      {type === 'albums' && <AlbumSearch createAlbum={createAlbum} />}
      {type === 'movies' && <MovieSearch createMovie={createMovie} />}
      {type === 'books' && <BookSearch createBook={createBook} />}
      {type === 'games' && <GameSearch createGame={createGame} />}
      {type === 'users' && <UserSearch />}
    </div>
  );
};

Search.propTypes = {
  createAlbum: PropTypes.func.isRequired,
  createBook: PropTypes.func.isRequired,
  createMovie: PropTypes.func.isRequired,
  createGame: PropTypes.func.isRequired,
};

export default Search;
