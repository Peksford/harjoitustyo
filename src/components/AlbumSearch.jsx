import React from 'react';
import axios from 'axios';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import albumService from '../services/albums';
import AlbumAdvancedSearch from './AlbumAdvancedSearch';

const styles = {
  albumContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  albumInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  thumbnail: {
    width: '200px',
    height: '200px',
    marginRight: '1rem',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  separator: {
    border: 'px solid #ccc',
    margin: '10px 0',
  },
  sliderContainer: {
    marginTop: '10px',
  },
  slider: {
    width: '100%',
  },
  silderNumbers: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '5px',
    fontSize: '14px',
  },
  rating: {
    margin: 0,
  },
  circle: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    border: '4px solid #646cff',
    backgroundColor: 'transparent',
    // color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '15px',
    fontWeight: 'bold',
  },
  circleText: {
    margin: 0,
  },
};

const useField = (type) => {
  const [value, setValue] = useState('');

  const onChange = (event) => {
    setValue(event.target.value);
  };

  return {
    type,
    value,
    onChange,
  };
};

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);
  return debouncedValue;
};

const useAlbum = (name) => {
  const [albumSearched, setAlbumSearched] = useState([]);

  useEffect(() => {
    if (!name) {
      setAlbumSearched([]);
      return;
    }
    if (!name) return;
    const searchAlbum = async () => {
      const token = import.meta.env.VITE_TOKEN;

      try {
        const response = await axios.get(
          'https://api.discogs.com/database/search',
          {
            headers: {
              Authorization: `Discogs token=${token}`,
            },
            params: {
              q: name,
              per_page: 40,
              page: 1,
              type: 'master',
            },
          }
        );
        setAlbumSearched(response.data.results);

        if (response.data.results.length === 0) {
          const response = await axios.get(
            'https://api.discogs.com/database/search',
            {
              headers: {
                Authorization: `Discogs token=${token}`,
              },
              params: {
                q: name,
                per_page: 40,
                page: 1,
                type: 'release',
              },
            }
          );

          setAlbumSearched(response.data.results);
        }
      } catch (error) {
        console.error(error);
      }
    };

    searchAlbum();
  }, [name]);
  return albumSearched;
};

const Album = ({ albumSearched, createAlbum }) => {
  if (albumSearched === null || albumSearched === undefined) {
    return <div>not found</div>;
  }
  const [addedAlbums, setAddedAlbums] = useState([]);
  const [ratings, setRatings] = useState({});

  const createNew = async ({ album }) => {
    try {
      const newAlbum = await createAlbum({
        type: 'album',
        artist: album.title.split(' - ')[0].trim(),
        title: album.title.split(' - ')[1].trim(),
        url: album.uri,
        year: album.year,
        thumbnail: album.cover_image,
        whole_title: album.title,
        discogs_id: album.id,
        heart: false,
      });

      newAlbum && setAddedAlbums((prevAlbums) => [...prevAlbums, newAlbum]);
      return newAlbum;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const changeRating = async (newRating, addedAlbum) => {
    setRatings((prevRatings) => ({
      ...prevRatings,
      [addedAlbum.id]: newRating,
    }));
    if (!addedAlbum) return;

    try {
      const updatedAlbum = await albumService.updatedAlbum(addedAlbum.id, {
        ...addedAlbum,
        rating: newRating,
      });
      setAddedAlbums((prevAlbums) =>
        prevAlbums.map((album) =>
          album.id === updatedAlbum.id ? updatedAlbum : album
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h4>
        {albumSearched.map((album) => {
          const alreadyAdded =
            addedAlbums.length > 0 &&
            addedAlbums.some(
              (added) =>
                added.whole_title === album.title &&
                Number(added.year) === Number(album.year)
            );
          const album_rating = addedAlbums.find(
            (added) => added.whole_title === album.title
          );
          return (
            <div key={album.id}>
              <div style={styles.albumContainer}>
                <img src={album.cover_image} style={styles.thumbnail} />
                <div style={styles.albumInfo}>
                  <p>{album.title}</p>
                  {album.year && <p>Year: {album.year}</p>}
                  {album.uri && (
                    <p>
                      <a
                        href={`https://www.discogs.com${album.uri}`}
                        target="blank"
                        rel="noopener noreferrer"
                      >
                        Discogs
                      </a>
                    </p>
                  )}
                </div>
                <div>
                  {alreadyAdded ? (
                    <Popup
                      trigger={<button className="button-text">Rate</button>}
                      modal
                      nested
                      contentStyle={{ maxWidth: '95vw', width: '600px' }}
                    >
                      {(close) => (
                        <div className="modal-container">
                          <div className="modal-header">{album.title}</div>
                          {album_rating && ratings[album_rating.id] ? (
                            <div style={styles.circle}>
                              <span style={styles.circleText}>
                                {ratings[album_rating.id]}
                              </span>
                            </div>
                          ) : null}
                          <div className="modal-content">
                            <div style={styles.sliderContainer}>
                              <label htmlFor="rating-slider">Your Rating</label>
                              <input
                                type="range"
                                min="0"
                                max="10"
                                step="0.1"
                                value={
                                  (album_rating && ratings[album_rating.id]) ||
                                  0
                                }
                                onChange={(e) =>
                                  changeRating(
                                    parseFloat(e.target.value),
                                    addedAlbums.find(
                                      (added) =>
                                        added.whole_title === album.title
                                    )
                                  )
                                }
                                style={styles.slider}
                              />
                              <div style={styles.silderNumbers}>
                                <span>0</span>
                                <span>1</span>
                                <span>2</span>
                                <span>3</span>
                                <span>4</span>
                                <span>5</span>
                                <span>6</span>
                                <span>7</span>
                                <span>8</span>
                                <span>9</span>
                                <span>10</span>
                              </div>
                            </div>
                          </div>
                          <div className="modal-actions">
                            <button
                              className="close-btn"
                              onClick={() => close()}
                            >
                              Close
                            </button>
                          </div>
                        </div>
                      )}
                    </Popup>
                  ) : (
                    <button
                      onClick={() => createNew({ album })}
                      className="button-text"
                    >
                      Add
                    </button>
                  )}
                </div>
              </div>
              <hr style={styles.separator} />
            </div>
          );
        })}
      </h4>
    </div>
  );
};

const AlbumSearch = ({ createAlbum }) => {
  const albumInput = useField('text');
  const debouncedAlbum = useDebounce(albumInput.value, 1000);
  const album = useAlbum(debouncedAlbum);
  const [showResults, setShowResults] = useState(true);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [albumSearched, setAlbumSearched] = useState([]);

  const hideResults = () => setShowResults(!showResults);
  const hideSearch = () => setShowAdvancedSearch(!showAdvancedSearch);

  const handleAdvancedSearch = async (searchParams) => {
    try {
      const token = import.meta.env.VITE_TOKEN;
      const searchType = searchParams.ean
        ? 'release'
        : searchParams.type || 'master';
      console.log('SearchParams', searchParams);
      const response = await axios.get(
        'https://api.discogs.com/database/search',
        {
          headers: { Authorization: `Discogs token=${token}` },
          params: {
            artist: searchParams.artist || undefined,
            release_title: searchParams.album || undefined,
            year:
              searchParams.startYear + '-' + searchParams.endYear || undefined,
            // startYear: searchParams.startYear || '',
            // endYear: searchParams.endYear || '',
            type: searchType,
            format: searchParams.format || undefined,
            country: searchParams.language || undefined,
            genre: searchParams.genre || undefined,
            style: searchParams.style || undefined,
            sort: searchParams.sort || 'relevance',
            barcode: searchParams.ean || undefined,
            per_page: 40,
            page: 1,
          },
        }
      );
      setAlbumSearched(response.data.results);
    } catch (error) {
      console.error('Error making advanced search', error);
    }
  };

  return (
    <>
      <div style={{ width: '70%' }}>
        <input
          className="search-input"
          {...albumInput}
          data-testid="Search album"
          placeholder="Search for an album"
          onFocus={() => setShowResults(true)}
        />
        <button
          onClick={hideSearch}
          style={{ marginTop: '10px', marginBottom: '10px' }}
        >
          {showAdvancedSearch ? 'Hide advanced search' : 'Advanced search'}
        </button>
        {showAdvancedSearch && (
          <AlbumAdvancedSearch onSearch={handleAdvancedSearch} />
        )}

        {debouncedAlbum && (
          <button onClick={hideResults}>
            {showResults ? 'Hide results' : 'Show results'}
          </button>
        )}
      </div>
      <div style={{ width: '100%' }}>
        {showResults && (
          <Album
            albumSearched={albumSearched.length ? albumSearched : album}
            createAlbum={createAlbum}
          />
        )}
      </div>
    </>
  );
};

Album.propTypes = {
  albumSearched: PropTypes.array.isRequired,
  createAlbum: PropTypes.func.isRequired,
};

AlbumSearch.propTypes = {
  createAlbum: PropTypes.func.isRequired,
};

export default AlbumSearch;
