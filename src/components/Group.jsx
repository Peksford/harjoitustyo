import React from 'react';
import { useState } from 'react';
import PropTypes from 'prop-types';
import UserMenu from './UserMenu';
import { useSelector } from 'react-redux';
import 'reactjs-popup/dist/index.css';
import AlbumGroups from './AlbumGroups';
import MovieGroups from './MovieGroups';
import BookGroups from './BookGroups';
import GameGroups from './GameGroups';
import GroupGroups from './GroupGroups';

const Group = () => {
  const [searchWord, setSearchWord] = useState('');
  const [type, setType] = useState('albums');

  const albums = useSelector((state) => state.albums);
  const books = useSelector((state) => state.books);
  const movies = useSelector((state) => state.movies);
  const games = useSelector((state) => state.games);
  const groups = useSelector((state) => state.groups);

  const searchItem = (searchWord) => {
    let searchedItem = {};

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
    } else if (type === 'groups') {
      searchedItem = groups.filter((group) =>
        group.name.toLowerCase().includes(searchWord.toLowerCase())
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

  const displayAlbums = type === 'albums' ? searchItem(searchWord) : null;
  const displayMovies = type === 'movies' ? searchItem(searchWord) : null;
  const displayBooks = type === 'books' ? searchItem(searchWord) : null;
  const displayGames = type === 'games' ? searchItem(searchWord) : null;
  const displayGroups = type === 'groups' ? searchItem(searchWord) : null;

  const sortedAlbums =
    displayAlbums &&
    displayAlbums.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const sortedMovies =
    displayMovies &&
    displayMovies.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const sortedBooks =
    displayBooks &&
    displayBooks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const sortedGames =
    displayGames &&
    displayGames.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const sortedGroups =
    displayGroups &&
    displayGroups.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div>
      <UserMenu />
      <h3 style={{ textAlign: 'center', marginTop: '20px' }}>
        Create a new rating club for you and your friends
      </h3>
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
            value="groups"
            data-testid="group"
            checked={type === 'groups'}
            onChange={handleTypeChange}
          />{' '}
          Your groups{' '}
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
      <AlbumGroups sortedAlbums={sortedAlbums} />
      <MovieGroups sortedMovies={sortedMovies} />
      <BookGroups sortedBooks={sortedBooks} />
      <GameGroups sortedGames={sortedGames} />
      <GroupGroups sortedGroups={sortedGroups} />
    </div>
  );
};

Group.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }),
};

export default Group;
