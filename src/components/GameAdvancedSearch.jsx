import React from 'react';
import { useState } from 'react';
import genres from '../services/igdb_genres';
import platforms from '../services/igdb_platforms';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import PropTypes from 'prop-types';

const GameAdvancedSearch = ({ onSearch }) => {
  const [searchParams, setSearchParams] = useState({
    advancedName: '',
    genre: '',
    platform: '',
    startYear: '',
    endYear: '',
    company: '',
    rating: '',
  });
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
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

  const sortedPlatforms = platforms.sort((a, b) => {
    if (a.name < b.name) {
      return -1;
    }
  });

  const sortedGenres = genres.sort((a, b) => {
    if (a.name < b.name) {
      return -1;
    }
  });

  const handleDateChange = (date, field) => {
    if (field === 'start') {
      const year = date ? date.getFullYear() : null;
      setStartDate(date);

      setSearchParams((prev) => ({
        ...prev,
        startYear: year,
      }));
    } else if (field === 'end') {
      const year = date ? date.getFullYear() : null;
      setEndDate(date);
      setSearchParams((prev) => ({
        ...prev,
        endYear: year,
      }));
    }
  };

  return (
    <div style={{ width: '70%' }}>
      <form onSubmit={handleSubmit}>
        <input
          className="search-input"
          type="text"
          name="advancedName"
          placeholder="Name"
          value={searchParams.advancedName}
          onChange={handleChange}
        />
        <div style={{ marginTop: '10px', marginBottom: '10px' }}>
          Release year:{' '}
          <DatePicker
            selected={startDate}
            onChange={(date) => handleDateChange(date, 'start')}
            placeholderText="Start Date"
            dateFormat="yyyy"
            showYearPicker
            isClearable
          />
          <span> - </span>
          <DatePicker
            selected={endDate}
            onChange={(date) => handleDateChange(date, 'end')}
            placeholderText="End Date"
            dateFormat="yyyy"
            showYearPicker
            isClearable
          />
        </div>
        Genre:{' '}
        <select
          name="genre"
          onChange={handleChange}
          style={{ marginTop: '10px' }}
        >
          <option value="">Select a Genre</option>
          {sortedGenres.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>
        <div>
          Platform:{' '}
          <select
            name="platform"
            onChange={handleChange}
            style={{ marginTop: '10px' }}
          >
            <option value="">Select a Platform</option>
            {sortedPlatforms.map((platform) => (
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

GameAdvancedSearch.propTypes = {
  onSearch: PropTypes.func.isRequired,
};

export default GameAdvancedSearch;
