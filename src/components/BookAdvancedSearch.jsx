import React from 'react';
import { useState } from 'react';
import PropTypes from 'prop-types';

const BookAdvancedSearch = ({ onSearch, type }) => {
  const [searchParams, setSearchParams] = useState({
    query: '',
    column: '',
    year: '',
    edition: '',
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
  if (type === 'ISBNDB') {
    return (
      <div style={{ width: '90%' }}>
        <form onSubmit={handleSubmit}>
          <input
            className="search-input"
            type="text"
            name="query"
            placeholder="Query"
            value={searchParams.query}
            onChange={handleChange}
          />
          Search only in this category:{' '}
          <select
            name="column"
            onChange={handleChange}
            style={{ marginTop: '10px', width: '30%' }}
            disabled={!searchParams.query}
          >
            <option value=" "></option>
            <option value="title">Title</option>
            <option value="author">Author</option>

            {/* <option value="">Select a Genre</option> */}
            {/* {sortedGenres.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))} */}
          </select>
          <input
            className="search-input"
            type="text"
            name="year"
            placeholder="Year"
            value={searchParams.year}
            onChange={handleChange}
            disabled={!searchParams.query}
          />
          <input
            className="search-input"
            type="text"
            name="edition"
            placeholder="Edition"
            value={searchParams.edition}
            onChange={handleChange}
            disabled={!searchParams.query}
          />
          <input
            className="search-input"
            type="text"
            name="language"
            placeholder="Language"
            value={searchParams.language}
            onChange={handleChange}
            disabled={!searchParams.query}
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
  }
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
  type: PropTypes.string,
};

export default BookAdvancedSearch;
