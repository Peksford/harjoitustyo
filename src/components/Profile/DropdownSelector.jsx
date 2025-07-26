import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

const DropdownSelector = ({
  albums,
  movies,
  books,
  games,
  setAlbums,
  setMovies,
  setBooks,
  setGames,
}) => {
  return (
    <DropdownButton
      id="dropdown-secondary-button"
      title={
        albums
          ? 'Albums'
          : movies
          ? 'Movies'
          : games
          ? 'Games'
          : books
          ? 'Books'
          : 'Albums'
      }
    >
      <Dropdown.Item
        onClick={() => {
          setAlbums(true);
          setMovies(false);
          setGames(false);
          setBooks(false);
        }}
      >
        Albums
      </Dropdown.Item>
      <Dropdown.Item
        onClick={() => {
          setMovies(true);
          setAlbums(false);
          setGames(false);
          setBooks(false);
        }}
      >
        Movies
      </Dropdown.Item>
      <Dropdown.Item
        onClick={() => {
          setGames(true);
          setMovies(false);
          setAlbums(false);
          setBooks(false);
        }}
      >
        Games
      </Dropdown.Item>
      <Dropdown.Item
        onClick={() => {
          setBooks(true);
          setMovies(false);
          setGames(false);
          setAlbums(false);
        }}
      >
        Books
      </Dropdown.Item>
    </DropdownButton>
  );
};

export default DropdownSelector;
