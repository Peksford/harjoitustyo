import React from 'react';
import { useState } from 'react';
import AlbumSearch from './AlbumSearch';
import MovieSearch from './MovieSearch';
import BookSearch from './BookSearch';
import GameSearch from './GameSearch';

const Search = ({ createAlbum, createBook, createMovie, createGame }) => {
  const [type, setType] = useState('albums');

  const handleTypeChange = (event) => {
    setType(event.target.value);
  };

  return (
    <div>
      <div>
        <label>
          <input
            type="radio"
            value="albums"
            checked={type === 'albums'}
            onChange={handleTypeChange}
          />
          Albums
        </label>
        <label>
          <input
            type="radio"
            value="movies"
            checked={type === 'movies'}
            onChange={handleTypeChange}
          />
          Movies
        </label>
        <label>
          <input
            type="radio"
            value="books"
            checked={type === 'books'}
            onChange={handleTypeChange}
          />
          Books
        </label>
        <label>
          <input
            type="radio"
            value="games"
            checked={type === 'games'}
            onChange={handleTypeChange}
          />
          Games
        </label>
      </div>
      {type === 'albums' && <AlbumSearch createAlbum={createAlbum} />}
      {type === 'movies' && <MovieSearch createMovie={createMovie} />}
      {type === 'books' && <BookSearch createBook={createBook} />}
      {type === 'games' && <GameSearch createGame={createGame} />}
    </div>
  );
};

export default Search;
