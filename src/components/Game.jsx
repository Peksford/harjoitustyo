import React from 'react';
import { useParams } from 'react-router-dom';
import gameService from '../services/games';
import userService from '../services/users';
import { useState, useEffect } from 'react';
import Heart from 'react-heart';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { setNotification } from '../reducers/notificationReducer';
import { useDispatch } from 'react-redux';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { useSelector } from 'react-redux';
import igdbLogo from '../assets/IGDB_logo.svg.png';
import { gameHeart } from '../reducers/gameReducer';

const Game = ({ onUpdateGame, createGame }) => {
  const { username, id } = useParams();
  const [gameData, setGameData] = useState('');
  const [rating, setRating] = useState(0);
  const [active, setActive] = useState(false);

  const [open, setOpen] = useState(false);
  const [openHeart, setOpenHeart] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);
  const games = useSelector((state) => state.games);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const game = await gameService.getGame(id);
        const user = await userService.getUserGames(username);

        if (user[0].user_id === game.user_id) {
          setGameData(game);
          setActive(game.heart || false);
          setRating(game.rating || 0);
        } else {
          return setGameData(null);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchGame();
  }, [id, username]);

  const handleHeartClick = async () => {
    try {
      setOpenHeart(true);
      const updatedHeart = await gameService.heartClick(gameData.id, {
        ...gameData,
        heart: true,
      });
      setGameData(updatedHeart);
      setActive(updatedHeart.heart);
      dispatch(gameHeart(gameData));

      if (onUpdateGame) {
        onUpdateGame(updatedHeart);
      }
      setOpenHeart(false);
    } catch (error) {
      console.error('error pressing heart', error);
    }
  };

  const changeRating = async (newRating) => {
    setRating(newRating);

    try {
      const updatedRating = await gameService.updatedGame(gameData.id, {
        ...gameData,
        rating: newRating,
      });
      setGameData(updatedRating);
      if (onUpdateGame) {
        onUpdateGame(updatedRating);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteGame = async (id) => {
    try {
      setOpen(true);
      await gameService.deleteGame(id);
      setGameData(null);
      dispatch(
        setNotification(`${gameData.title} was removed from your list`, 5)
      );
      navigate(`/${username}/games`);
    } catch (error) {
      console.error(error);
    }
  };
  const createNew = async ({ gameData }) => {
    try {
      const newGame = await createGame({
        type: 'game',
        title: gameData.title || 'Untitled',
        url: gameData.url,
        release_date: gameData.release_date || null,
        thumbnail: gameData.thumbnail,
        whole_title: gameData.whole_title,
        key: gameData.id,
        heart: false,
        summary: gameData.summary,
        genres: gameData.genres,
        igdb_id: gameData.igdb_id,
      });
      return newGame;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClickHeartOpen = () => {
    setOpenHeart(true);
  };
  const handleHeartClose = () => {
    setOpenHeart(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleRemoveConfirm = () => {
    deleteGame(gameData.id);
    setOpen(false);
  };

  if (gameData) {
    return (
      <>
        <div>
          <div>
            back to <Link to={`/${username}`}>{username}</Link> home page
          </div>
        </div>
        <div>
          <div style={styles.gameInfo}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <h2>{gameData.whole_title}</h2>

              <div
                data-testid="heart"
                style={{
                  width: '3.5rem',
                  display: 'inline-block',
                  marginLeft: '10px',
                }}
              >
                <Heart
                  isActive={active || false}
                  onClick={() => {
                    if (!games.find((game) => game.heart === true)) {
                      handleClickHeartOpen();
                    } else {
                      dispatch(
                        setNotification(
                          `You have already selected game of the week`,
                          5
                        )
                      );
                    }
                  }}
                  style={{
                    fontSize: '3rem',
                    display: 'block',
                    textAlign: 'cenSorrter',
                  }}
                />
                <Dialog
                  open={openHeart}
                  onClose={handleHeartClose}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <DialogTitle id="alert-dialog-title">
                    {`Do you want to make ${gameData.title} your game of the week?`}
                  </DialogTitle>
                  <DialogActions>
                    <Button onClick={handleHeartClose}>No</Button>
                    <Button onClick={handleHeartClick} autoFocus>
                      {' '}
                      Yes
                    </Button>
                  </DialogActions>
                </Dialog>
              </div>
            </div>

            <a href={gameData.url} target="blank" rel="noopener noreferrer">
              <img
                src={igdbLogo}
                style={{
                  width: '100%',
                  maxWidth: '100px',
                  height: 'auto',
                  marginBottom: '10px',
                }}
              />
            </a>
            <img
              src={gameData.thumbnail.replace(/t_thumb/, 't_cover_big')}
              style={styles.thumbnail}
            />
            {gameData.genres && <h3>Genres: {gameData.genres}</h3>}
            {gameData.release_date && (
              <h3>
                Released:{' '}
                {new Date(gameData.release_date * 1000).toLocaleDateString()}
              </h3>
            )}

            {gameData.summary && (
              <p
                style={{
                  fontSize: '14px',
                  maxWidth: '400px',
                  wordWrap: 'break-word',
                }}
              >
                {gameData.summary}
              </p>
            )}
            <div style={styles.thumbNailContainer}>
              {gameData.rating ? (
                <div style={styles.circle}>
                  <span style={styles.circleText}>{gameData.rating}</span>
                </div>
              ) : null}
            </div>
            {gameData.user_id === (user?.id || 0) ? (
              <div style={styles.sliderContainer}>
                <label htmlFor="rating-slider">Your Rating</label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.1"
                  value={rating || 0}
                  onChange={(e) => changeRating(parseFloat(e.target.value))}
                  style={styles.slider}
                />
                <div style={styles.silderNumbers}>
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
            ) : null}
          </div>

          <div>
            {username} added this on{' '}
            {new Date(gameData.createdAt).toLocaleDateString()}
          </div>

          <div>
            {user && user.id === gameData.user_id ? (
              <>
                <button onClick={handleClickOpen}>Remove</button>
                <Dialog
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <DialogTitle id="alert-dialog-title">
                    {`Do you want to remove ${gameData.title} from your list?`}
                  </DialogTitle>
                  <DialogActions>
                    <Button onClick={handleClose}>No</Button>
                    <Button onClick={handleRemoveConfirm} autoFocus>
                      {' '}
                      Yes
                    </Button>
                  </DialogActions>
                </Dialog>
              </>
            ) : (
              <>
                <button
                  onClick={() => createNew({ gameData })}
                  className="button-text"
                >
                  Add to your list
                </button>
              </>
            )}
          </div>
        </div>
      </>
    );
  }
};

const styles = {
  gameContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
  },
  gameInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  thumbNailContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  thumbnail: {
    width: '180px',
    height: '200px',
    objectFit: 'cover',
    marginBottom: '8px',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
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
  separator: {
    border: 'px solid #ccc',
    margin: '10px 0',
  },
  circle: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    border: '4px solid #646cff',
    backgroundColor: 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    fontWeight: 'bold',
  },
  circleText: {
    margin: 0,
  },
};

Game.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }),
  onUpdateGame: PropTypes.func,
  createGame: PropTypes.func.isRequired,
};

export default Game;
