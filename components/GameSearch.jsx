import React from 'react';
import axios from 'axios';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

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
    if (!name) {
      setGameSearched([]);
      return;
    }
    const searchGame = async () => {
      try {
        const response = await axios.get(
          'https://im-only-rating.fly.dev/api/games/search-game',
          {
            params: {
              name: name,
            },
          }
        );
        setGameSearched(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    searchGame();
  }, [name]);

  return gameSearched;
};

const Game = ({ gameSearched, createGame }) => {
  if (gameSearched === null || gameSearched === undefined) {
    return <div>not found</div>;
  }

  const createNew = ({ game }) => {
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
                  <button
                    onClick={() => createNew({ game })}
                    className="button-text"
                  >
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
    <div style={{ width: '400px' }}>
      <input
        className="search-input"
        {...gameInput}
        data-testid="Search game"
        placeholder="Search for a game"
      />
      <Game gameSearched={game} createGame={createGame} />
    </div>
  );
};

Game.propTypes = {
  gameSearched: PropTypes.array.isRequired,
  createGame: PropTypes.func.isRequired,
};

GameSearch.propTypes = {
  createGame: PropTypes.func.isRequired,
};

export default GameSearch;
