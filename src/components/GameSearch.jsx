import React from 'react';
import axios from 'axios';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import gameService from '../services/games';
import GameAdvancedSearch from './GameAdvancedSearch';
import igdbLogo from '../assets/IGDB_logo.svg.png';
import { useSelector, useDispatch } from 'react-redux';
import { setGames } from '../reducers/gameReducer';
import { Link } from 'react-router-dom';

const styles = {
  gameContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px',
  },
  GameInfoAndButtons: {
    display: 'flex',
    flexDirection: 'column',
  },
  gameInfo: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  thumbnail: {
    width: '200px',
    height: '290px',
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

const useGame = (name) => {
  const [gameSearched, setGameSearched] = useState([]);

  useEffect(() => {
    if (!name) {
      setGameSearched([]);
      return;
    }
    if (!name) return;

    const searchGame = async () => {
      try {
        const baseURL =
          import.meta.env.MODE === 'development'
            ? 'http://localhost:3001'
            : 'https://im-only-rating.fly.dev';

        const response = await axios.get(`${baseURL}/api/games/search-game`, {
          params: {
            name: name,
          },
        });
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

  const user = useSelector((state) => state.user);
  const games = useSelector((state) => state.games);

  const dispatch = useDispatch();

  const createNew = async ({ game }) => {
    const newGame = await createGame({
      type: 'game',
      title: game.name || 'Untitled',
      url: game.url,
      release_date: game.first_release_date || null,
      thumbnail: game.cover.url,
      whole_title: game.name,
      key: game.id,
      heart: false,
      summary: game.summary,
      genres: game.genres.map((genre) => genre.name).join(', '),
      igdb_id: game.id,
    });

    return newGame;
  };

  const changeRating = async (newRating, addedGame) => {
    if (!addedGame) return;

    try {
      const updatedGame = await gameService.updatedGame(addedGame.id, {
        ...addedGame,
        rating: newRating,
      });
      const updatedGames = games.map((game) =>
        game.id === updatedGame.id ? updatedGame : game
      );

      dispatch(setGames(updatedGames));
    } catch (error) {
      console.error(error);
    }
  };

  const popUpWindow = ({ game, gameFounded }) => {
    return (
      <Popup
        trigger={
          <button style={{ marginBottom: '10px' }} className="button-text">
            Rate
          </button>
        }
        modal
        nested
        contentStyle={{
          maxWidth: '95vw',
          width: '600px',
        }}
      >
        {(close) => (
          <div className="modal-container">
            <div className="modal-header">{game && game.title}</div>
            {gameFounded ? (
              <div style={styles.circle}>
                <span style={styles.circleText}>{gameFounded?.rating}</span>
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
                  value={(gameFounded && gameFounded?.rating) || 0}
                  onChange={(e) =>
                    changeRating(
                      parseFloat(e.target.value),
                      games.find((added) => added.igdb_id === game.id)
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
              <button onClick={() => close()}>Ok</button>
            </div>
          </div>
        )}
      </Popup>
    );
  };

  return (
    <div>
      <h4>
        {gameSearched.map((game) => {
          const gameFounded = games.find((item) => item.igdb_id === game.id);

          return (
            <div key={game.id}>
              <div style={styles.gameContainer}>
                <Link
                  to={
                    gameFounded && `/${user.username}/games/${gameFounded.id}`
                  }
                >
                  {game.cover && (
                    <img
                      src={`https:${game.cover.url.replace(
                        /t_thumb/,
                        't_cover_big'
                      )}`}
                      style={styles.thumbnail}
                    />
                  )}
                </Link>
                <div style={styles.GameInfoAndButtons}>
                  <div style={styles.gameInfo}>
                    <Link
                      to={
                        gameFounded &&
                        `/${user.username}/games/${gameFounded.id}`
                      }
                    >
                      <p>{game.name}</p>
                    </Link>
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
                    {game.rating && (
                      <p>IGDB rating: {Math.round(game.rating)}</p>
                    )}
                    {game.url && (
                      <p>
                        <a
                          href={game.url}
                          target="blank"
                          rel="noopener noreferrer"
                        >
                          <img
                            style={{
                              width: '100%',
                              maxWidth: '70px',
                              height: 'auto',
                            }}
                            src={igdbLogo}
                          />
                        </a>
                      </p>
                    )}
                    {gameFounded ? (
                      popUpWindow({ game, gameFounded })
                    ) : (
                      <button
                        style={{ width: '100px' }}
                        onClick={() => createNew({ game })}
                        className="button-text"
                      >
                        Add
                      </button>
                    )}
                    {gameFounded && (
                      <div style={styles.circle}>{gameFounded?.rating}</div>
                    )}
                  </div>
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

const GameSearch = ({ createGame }) => {
  const gameInput = useField('text');
  const debouncedGame = useDebounce(gameInput.value, 1000);
  const game = useGame(debouncedGame);
  const [showResults, setShowResults] = useState(true);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [gameSearched, setGameSearched] = useState([]);

  const hideResults = () => setShowResults(!showResults);
  const hideSearch = () => setShowAdvancedSearch(!showAdvancedSearch);

  const handleAdvancedSearch = async (searchParams) => {
    try {
      setGameSearched([]);
      const baseURL =
        import.meta.env.MODE === 'development'
          ? 'http://localhost:3001'
          : 'https://im-only-rating.fly.dev';
      const response = await axios.get(`${baseURL}/api/games/search-game`, {
        params: {
          advancedName: searchParams.advancedName || '',
          genre: searchParams.genre || '',
          platform: searchParams.platform || '',
          startYear: searchParams.startYear || '',
          endYear: searchParams.endYear || '',
          company: searchParams.company || '',
          rating: searchParams.rating || '',
          sortBy: searchParams.sortBy || '',
        },
      });

      setGameSearched(response.data);
    } catch (error) {
      console.error('Error making advanced search', error);
    }
  };

  return (
    <>
      <div
        style={{
          width: '90%',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginTop: '10px',
        }}
      >
        <img
          src={igdbLogo}
          style={{ width: '100%', maxWidth: '100px', height: 'auto' }}
        />

        <input
          className="search-input"
          {...gameInput}
          data-testid="Search game"
          placeholder="Search for a game"
          onFocus={() => setShowResults(true)}
        />
      </div>
      <button
        onClick={hideSearch}
        style={{ marginTop: '10px', marginBottom: '10px', marginRight: '10px' }}
      >
        {showAdvancedSearch ? 'Hide advanced search' : 'Advanced search'}
      </button>
      {showAdvancedSearch && (
        <GameAdvancedSearch onSearch={handleAdvancedSearch} />
      )}

      {debouncedGame && (
        <button onClick={hideResults}>
          {showResults ? 'Hide results' : 'Show results'}
        </button>
      )}

      <div style={{ width: '100%' }}>
        {showResults && (
          <Game
            gameSearched={gameSearched.length ? gameSearched : game}
            createGame={createGame}
          />
        )}
      </div>
    </>
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
