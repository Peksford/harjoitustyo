import React from 'react';
import axios from 'axios';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

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
  const createNew = ({ album }) => {
    try {
      createAlbum({
        artist: album.title.split(' - ')[0].trim(),
        title: album.title.split(' - ')[1].trim(),
        url: album.uri,
        year: album.year,
        thumbnail: album.cover_image,
        whole_title: album.title,
        discogs_id: album.id,
        heart: false,
      });
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div>
      <h4>
        {albumSearched.map((album) => (
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
              <div style={styles.buttonContainer}>
                <button
                  onClick={() => createNew({ album })}
                  className="button-text"
                >
                  Add to My List
                </button>
              </div>
            </div>
            <hr style={styles.separator} />
          </div>
        ))}
      </h4>
    </div>
  );
};

const AlbumSearch = ({ createAlbum }) => {
  const albumInput = useField('text');
  const debouncedAlbum = useDebounce(albumInput.value, 1000);
  const album = useAlbum(debouncedAlbum);

  return (
    <div>
      <input
        className="search-input"
        {...albumInput}
        data-testid="Search album"
        placeholder="Search for an album"
      />
      <Album albumSearched={album} createAlbum={createAlbum} />
    </div>
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
