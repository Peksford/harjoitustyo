import axios from 'axios';
import { useState, useEffect } from 'react';
import React from 'react';

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
              per_page: 10,
              page: 1,
              type: 'release',
            },
          }
        );
        console.log('Release data works?', response.data);
        setAlbumSearched(response.data.results);
      } catch (error) {
        console.error(error);
      }
    };

    searchAlbum();
  }, [name]);

  console.log('what happens here', albumSearched);
  return albumSearched;
};

const Album = ({ albumSearched, createAlbum }) => {
  if (albumSearched === null || albumSearched === undefined) {
    return <div>not found</div>;
  }

  const createNew = ({ album }) => {
    createAlbum({
      artist: album.title.split(' - ')[0].trim(),
      title: album.title.split(' - ')[1].trim(),
      url: album.uri,
      year: album.year,
      thumbnail: album.cover_image,
      whole_title: album.title,
    });
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
                <button onClick={() => createNew({ album })}>
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
  const debouncedAlbum = useDebounce(albumInput.value, 500);
  const album = useAlbum(debouncedAlbum);

  return (
    <div>
      <input {...albumInput} placeholder="Search for an album" />
      <Album albumSearched={album} createAlbum={createAlbum} />
    </div>
  );
};

export default AlbumSearch;
