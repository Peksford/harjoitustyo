import React from 'react';
import { useState } from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const AlbumAdvancedSearch = ({ onSearch }) => {
  const [searchParams, setSearchParams] = useState({
    artist: '',
    album: '',
    startYear: '',
    endYear: '',
    type: 'master',
    language: '',
    genre: '',
    style: '',
  });
  const [showTooltip, setShowTooltip] = useState(false);
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
    <div style={{ width: '90%' }}>
      <form onSubmit={handleSubmit}>
        <select
          name="type"
          onChange={handleChange}
          value={searchParams.ean ? 'release' : searchParams.type}
          disabled={!!searchParams.ean}
          style={{ marginTop: '10px' }}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <option value="master">Main Album</option>
          <option value="release">Vinyl/CD Version</option>
        </select>
        {showTooltip && (
          <div
            style={{
              bottom: '100%',
              left: '0',
              backgroundColor: '#333',
              color: '#fff',
              padding: '6px 10px',
              borderRadius: '6px',
              fontSize: '14px',
              whiteSpace: 'normal',
              wordWrap: 'break-word',
              maxWidth: '200px',
              boxShadow: '0px 0px 5px rgba(0,0,0,0.2)',
              zIndex: 10,
            }}
          >
            &quot;Main Album&quot; shows the entire collection of versions for
            an album, while &quot;Vinyl/CD&quot; Version filters for a specific
            release format like Vinyl, CD or Digital region.
          </div>
        )}
        <div>
          Sort by:{' '}
          <select
            name="sort"
            onChange={handleChange}
            style={{ marginTop: '10px' }}
          >
            <option value="relevancer">Relevance</option>
            <option value="year">Year</option>
            <option value="title">Title</option>
          </select>
        </div>
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
        {/* <input
          className="search-input"
          type="text"
          name="year"
          placeholder="Year (e. g. 1962-1970)"
          value={searchParams.year}
          onChange={handleChange}
        /> */}
        <input
          className="search-input"
          type="text"
          name="genre"
          placeholder="Genre (e.g. Rock)"
          value={searchParams.genre}
          onChange={handleChange}
        />
        <input
          className="search-input"
          type="text"
          name="style"
          placeholder="Style (e.g. Alternative Rock)"
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

AlbumAdvancedSearch.propTypes = {
  onSearch: PropTypes.func.isRequired,
};

export default AlbumAdvancedSearch;
