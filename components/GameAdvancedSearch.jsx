import React from 'react';
import { useState } from 'react';
import genres from '../services/igdb_genres';
import platforms from '../services/igdb_platforms';

const GameAdvancedSearch = ({ onSearch }) => {
  const [searchParams, setSearchParams] = useState({
    advancedName: '',
    genre: '',
    platform: '',
    year: '',
    company: '',
    rating: '',
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

  // const sortedCompanies = companies.sort((a, b) => {
  //   if (a.name < b.name) {
  //     return -1;
  //   }
  // });

  return (
    <div style={{ width: '70%' }}>
      <form onSubmit={handleSubmit}>
        {/* <select
          name="type"
          onChange={handleChange}
          value={searchParams.ean ? 'release' : searchParams.type}
          disabled={!!searchParams.ean}
          style={{ marginTop: '10px' }}
        >
          <option value="master">Master Game</option>
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
        </select> */}
        <input
          className="search-input"
          type="text"
          name="advancedName"
          placeholder="Name"
          value={searchParams.advancedName}
          onChange={handleChange}
        />
        <input
          className="search-input"
          type="text"
          name="year"
          placeholder="Year"
          value={searchParams.year}
          onChange={handleChange}
        />
        {/* <select
          name="type"
          onChange={handleChange}
          value={searchParams.ean ? 'release' : searchParams.type}
          disabled={!!searchParams.ean}
          style={{ marginTop: '10px' }}
        > */}
        Genre:{' '}
        <select
          name="genre"
          onChange={handleChange}
          style={{ marginTop: '10px' }}
        >
          <option value="">Select a Genre</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>
        {/* <input
          className="search-input"
          type="text"
          name="genre"
          placeholder="Genre"
          value={searchParams.genre}
          onChange={handleChange}
        /> */}
        <div>
          Platform:{' '}
          <select
            name="platform"
            onChange={handleChange}
            style={{ marginTop: '10px' }}
          >
            <option value="">Select a Platform</option>
            {platforms.map((platform) => (
              <option key={platform.id} value={platform.id}>
                {platform.name}
              </option>
            ))}
          </select>
        </div>
        <input
          className="search-input"
          type="text"
          name="company"
          placeholder="Company (Needs to be the exact name)"
          value={searchParams.company}
          onChange={handleChange}
        />
        {/* <div>
          Company:{' '}
          <select
            name="company"
            onChange={handleChange}
            style={{ marginTop: '10px' }}
          >
            <option value="">Select a Company</option>
            {sortedCompanies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
            {console.log('companies', sortedCompanies)}
          </select>
        </div> */}
        <input
          className="search-input"
          type="text"
          name="rating"
          placeholder="Rating value over in IGDB"
          value={searchParams.rating}
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

export default GameAdvancedSearch;
