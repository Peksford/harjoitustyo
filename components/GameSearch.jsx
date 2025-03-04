import React from 'react';
import axios from 'axios';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import gameService from '../services/games';
import { useSelector } from 'react-redux';

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

  const [addedGames, setAddedGames] = useState([]);
  const [ratings, setRatings] = useState({});

  const createNew = async ({ game }) => {
    const newGame = await createGame({
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
    newGame && setAddedGames((prevGames) => [...prevGames, newGame]);
    return addedGames;
  };

  const changeRating = async (newRating, addedGame) => {
    setRatings((prevRatings) => ({
      ...prevRatings,
      [addedGame.id]: newRating,
    }));
    if (!addedGame) return;

    try {
      const updatedGame = await gameService.updatedGame(addedGame.id, {
        ...addedGame,
        rating: newRating,
      });
      setAddedGames((prevGames) =>
        prevGames.map((game) =>
          game.id === updatedGame.id ? updatedGame : game
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h4>
        {gameSearched.map((game) => {
          const alreadyAdded =
            addedGames.length > 0 &&
            addedGames.some(
              (added) =>
                added.title === game.name &&
                Number(added.release_date) === game.first_release_date
            );
          const game_rating = addedGames.find(
            (added) => added.title === game.name
          );
          return (
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
                    {alreadyAdded ? (
                      <Popup
                        trigger={<button className="button-text">Rate</button>}
                        modal
                        nested
                        contentStyle={{ maxWidth: '95vw', width: '600px' }}
                      >
                        {(close) => (
                          <div className="modal-container">
                            <div className="modal-header">{game.name}</div>
                            {game_rating && ratings[game_rating.id] ? (
                              <div style={styles.circle}>
                                <span style={styles.circleText}>
                                  {ratings[game_rating.id]}
                                </span>
                              </div>
                            ) : null}
                            <div className="modal-content">
                              <div style={styles.sliderContainer}>
                                <label htmlFor="rating-slider">
                                  Your Rating
                                </label>
                                <input
                                  type="range"
                                  min="0"
                                  max="10"
                                  step="0.1"
                                  value={
                                    (game_rating && ratings[game_rating.id]) ||
                                    0
                                  }
                                  onChange={(e) =>
                                    changeRating(
                                      parseFloat(e.target.value),
                                      addedGames.find(
                                        (added) => added.title === game.name
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
                      /* // onClick={() =>
                      //   navigate(
                      //     `/${user.username}/games/${
                      //       addedGames.find(
                      //         (added) =>
                      //           added.whole_title === game.title &&
                      //           added.year === Number(game.year)
                      //       ).id
                      //     }`
                      //   )
                      // } */
                      /* className="button-text" */

                      // Rate this game
                      // </button>}
                      <button
                        onClick={() => createNew({ game })}
                        className="button-text"
                      >
                        Add
                      </button>
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

  const hideResults = () => {
    if (showResults === true) {
      setShowResults(false);
    } else {
      setShowResults(true);
    }
  };

  return (
    <>
      <div style={{ width: '70%' }}>
        <input
          className="search-input"
          {...gameInput}
          data-testid="Search game"
          placeholder="Search for an game"
          onFocus={() => setShowResults(true)}
        />
        {debouncedGame && (
          <button onClick={hideResults}>
            {showResults ? 'Hide results' : 'Show results'}
          </button>
        )}
      </div>
      <div style={{ width: '100%' }}>
        {showResults && <Game gameSearched={game} createGame={createGame} />}
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
