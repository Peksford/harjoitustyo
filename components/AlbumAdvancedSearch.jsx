import React from 'react';
import { useState } from 'react';

const AlbumAdvancedSearch = ({ onSearch }) => {
  const [searchParams, setSearchParams] = useState({
    artist: '',
    album: '',
    year: '',
    type: 'master',
    language: '',
    style: '',
  });
  const handleChange = (e) => {
    setSearchParams((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchParams);
  };

  return (
    <div style={{ width: '70%' }}>
      <form onSubmit={handleSubmit}>
        <select
          name="type"
          onChange={handleChange}
          value={searchParams.ean ? 'release' : searchParams.type}
          disabled={!!searchParams.ean}
          style={{ marginTop: '10px' }}
        >
          <option value="master">Master Album</option>
          <option value="release">Different versions</option>
        </select>
        <select
          name="sort"
          onChange={handleChange}
          style={{ marginTop: '10px' }}
        >
          <option value="relevancer">Relevance</option>
          <option value="year">Year</option>
          <option value="title">Title</option>
        </select>
        <input
          className="search-input"
          type="text"
          name="artist"
          placeholder="Artist"
          value={searchParams.artist}
          onChange={handleChange}
        />
        <input
          className="search-input"
          type="text"
          name="album"
          placeholder="Album Title"
          value={searchParams.album}
          onChange={handleChange}
        />
        <input
          className="search-input"
          type="text"
          name="year"
          placeholder="Year (e. g. 1962-1970)"
          value={searchParams.year}
          onChange={handleChange}
        />
        <input
          className="search-input"
          type="text"
          name="style"
          placeholder="Style (e.g. Rock)"
          value={searchParams.style}
          onChange={handleChange}
        />
        <input
          className="search-input"
          type="text"
          name="language"
          placeholder="Language/Country (e.g. UK, US)"
          value={searchParams.language}
          onChange={handleChange}
        />
        <input
          className="search-input"
          type="text"
          name="format"
          placeholder="Format (e.g. Vinyl, CD)"
          value={searchParams.format}
          onChange={handleChange}
        />
        <input
          className="search-input"
          type="text"
          name="ean"
          placeholder="EAN (Barcode)"
          value={searchParams.ean}
          onChange={handleChange}
        />
        <button
          type="submit"
          style={{ marginTop: '10px', marginBottom: '10px' }}
        >
          Search
        </button>
      </form>
    </div>
  );
};

export default AlbumAdvancedSearch;
