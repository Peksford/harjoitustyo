import axios from 'axios';
import { useState, useEffect } from 'react';
import React from 'react';

const styles = {
  gameContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px',
  },
  GameInfoAndButtons: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  gameInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  thumbnail: {
    width: '200px',
    height: '250px',
    objectFit: 'cover',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginTop: '8px',
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

const useGame = (name) => {
  const [gameSearched, setGameSearched] = useState([]);

  useEffect(() => {
    if (!name) return;
    const searchGame = async () => {
      try {
        const response = await axios.get(
          'http://localhost:3001/api/games/search-game',
          {
            params: {
              name: name,
            },
          }
        );
        console.log('game data works?', response.data);
        setGameSearched(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    searchGame();
  }, [name]);

  console.log('what happens here', gameSearched);
  return gameSearched;
};

const Game = ({ gameSearched, createGame }) => {
  if (gameSearched === null || gameSearched === undefined) {
    return <div>not found</div>;
  }

  const createNew = ({ game }) => {
    console.log('Testing game', game);
    createGame({
      title: game.name || 'Untitled',
      url: game.url,
      release_date: game.first_release_date || null,
      thumbnail: game.cover.url,
      whole_title: game.name,
      key: game.id,
      heart: false,
      summary: game.summary,
      genres: game.genres.map((genre) => genre.name).join(', '),
    });
  };

  return (
    <div>
      <h4>
        {gameSearched.map((game) => (
          <div key={game.id}>
            <div style={styles.gameContainer}>
              {game.cover && (
                <img
                  src={`https:${game.cover.url.replace(
                    /t_thumb/,
                    't_cover_big'
                  )}`}
                  style={styles.thumbnail}
                />
              )}
              <div style={styles.GameInfoAndButtons}>
                <div style={styles.gameInfo}>
                  <p>{game.name}</p>
                  {game.first_release_date && (
                    <p>
                      Released:{' '}
                      {new Date(
                        game.first_release_date * 1000
                      ).toLocaleDateString()}
                    </p>
                  )}
                  {game.genres && (
                    <p>
                      Genres:{' '}
                      {game.genres.map((genre) => genre.name).join(', ')}
                    </p>
                  )}

                  {game.url && (
                    <p>
                      <a
                        href={game.url}
                        target="blank"
                        rel="noopener noreferrer"
                      >
                        IGDB
                      </a>
                    </p>
                  )}
                </div>
                <div style={styles.buttonContainer}>
                  <button onClick={() => createNew({ game })}>
                    Add to My List
                  </button>
                </div>
              </div>
            </div>
            <hr style={styles.separator} />
          </div>
        ))}
      </h4>
    </div>
  );
};

const GameSearch = ({ createGame }) => {
  const gameInput = useField('text');
  const debouncedGame = useDebounce(gameInput.value, 1000);
  const game = useGame(debouncedGame);

  return (
    <div>
      <input {...gameInput} placeholder="Search for a game" />
      <Game gameSearched={game} createGame={createGame} />
    </div>
  );
};

export default GameSearch;
