import React from 'react';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import UserMenu from './UserMenu';
import userService from '../services/users';
import { useSelector } from 'react-redux';

const Group = () => {
  const [searchWord, setSearchWord] = useState('');
  const [type, setType] = useState('albums');

  const user = useSelector((state) => state.user);
  const albums = useSelector((state) => state.albums);
  const books = useSelector((state) => state.books);
  const movies = useSelector((state) => state.movies);
  const games = useSelector((state) => state.games);

  console.log('user', user);
  console.log('user', albums);

  const searchItem = (searchWord) => {
    let searchedItem = {};
    // if (!albums) return [];
    if (type === 'albums') {
      searchedItem = albums.filter((album) =>
        album.whole_title.toLowerCase().includes(searchWord.toLowerCase())
      );
    } else if (type === 'books') {
      searchedItem = books.filter((book) =>
        book.whole_title.toLowerCase().includes(searchWord.toLowerCase())
      );
    } else if (type === 'movies') {
      searchedItem = movies.filter((movie) =>
        movie.whole_title.toLowerCase().includes(searchWord.toLowerCase())
      );
    } else if (type === 'games') {
      searchedItem = games.filter((game) =>
        game.whole_title.toLowerCase().includes(searchWord.toLowerCase())
      );
    }

    return searchedItem;
  };

  const onChange = (event) => {
    setSearchWord(event.target.value);
  };
  const handleTypeChange = (event) => {
    setType(event.target.value);
  };

  const handleClick = () => {
    console.log('nice');
  };

  const displayAlbums = albums ? searchItem(searchWord) : null;

  return (
    <>
      <UserMenu />
      <div>Create a new rating group!</div>
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
      </div>

      <div style={{ width: '50%', marginBottom: '10px' }}>
        <input
          className="search-input"
          onChange={onChange}
          value={searchWord}
          data-testid="Search album"
          placeholder="Search"
        />
      </div>
      {displayAlbums &&
        displayAlbums.map((album) => (
          <div key={album.id}>
            {album.whole_title}
            <button onClick={handleClick}> Create</button>
          </div>
        ))}
    </>
  );
};

Group.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }),
};

export default Group;
