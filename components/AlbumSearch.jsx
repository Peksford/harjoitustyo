import axios from 'axios';
import { useState, useEffect } from 'react';

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
    // width: '100px',
    // height: '100px',
    marginRight: '1rem',
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

const Album = ({ albumSearched }) => {
  if (albumSearched === null || albumSearched === undefined) {
    return <div>not found</div>;
  }

  return (
    <div>
      <h4>
        {albumSearched.map((album) => (
          <div key={album.id} style={styles.albumContainer}>
            <img src={album.thumb} style={styles.thumbnail} />
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
          </div>
        ))}
      </h4>
    </div>
  );
};

const AlbumSearch = () => {
  const albumInput = useField('text');
  // const [albumName, setAlbumName] = useState('');
  const debouncedAlbum = useDebounce(albumInput.value, 500);
  const album = useAlbum(debouncedAlbum);

  // const fetch = (e) => {
  //   e.preventDefault();
  //   setAlbumName(albumInput.value);
  // };

  return (
    <div>
      {/* <form onSubmit={fetch}>
        <input {...albumInput} />
        <button>find</button>
      </form> */}
      <input {...albumInput} placeholder="Search for an album" />
      <Album albumSearched={album} />
    </div>
  );
};

export default AlbumSearch;
