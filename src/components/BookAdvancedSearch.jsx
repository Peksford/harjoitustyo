import React from 'react';
import { useState } from 'react';
import PropTypes from 'prop-types';

const BookAdvancedSearch = ({ onSearch }) => {
  const [searchParams, setSearchParams] = useState({
    title: '',
    author: '',
    subject: '',
    language: '',
    isbn: '',
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
    <div style={{ width: '90%' }}>
      <form onSubmit={handleSubmit}>
        <input
          className="search-input"
          type="text"
          name="title"
          placeholder="Title"
          value={searchParams.title}
          onChange={handleChange}
        />
        <input
          className="search-input"
          type="text"
          name="author"
          placeholder="Author"
          value={searchParams.author}
          onChange={handleChange}
        />
        <input
          className="search-input"
          type="text"
          name="subject"
          placeholder="Subject"
          value={searchParams.subject}
          onChange={handleChange}
        />
        <input
          className="search-input"
          type="text"
          name="language"
          placeholder="Language (e.g. eng)"
          value={searchParams.language}
          onChange={handleChange}
          disabled={
            !searchParams.title && !searchParams.author && !searchParams.subject
          }
        />
        <input
          className="search-input"
          type="text"
          name="isbn"
          placeholder="Isbn"
          value={searchParams.isbn}
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

BookAdvancedSearch.propTypes = {
  onSearch: PropTypes.func.isRequired,
};

export default BookAdvancedSearch;
