import { useState } from 'react';
import AlbumSearch from './AlbumSearch';
import BookSearch from './BookSearch';

const Search = ({ createAlbum, createBook }) => {
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
            value="books"
            checked={type === 'books'}
            onChange={handleTypeChange}
          />
          Books
        </label>
      </div>
      {type === 'albums' && <AlbumSearch createAlbum={createAlbum} />}
      {type === 'books' && <BookSearch createBook={createBook} />}
    </div>
  );
};

export default Search;
