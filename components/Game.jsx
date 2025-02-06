import React from 'react';
import { useParams } from 'react-router-dom';
import gameService from '../services/games';
import userService from '../services/users';
import { useState, useEffect } from 'react';
import Heart from 'react-heart';
import { Link } from 'react-router-dom';

const Game = ({ user, onUpdateGame }) => {
  const { username, id } = useParams();
  const [gameData, setGameData] = useState('');
  const [rating, setRating] = useState(0);
  const [active, setActive] = useState(false);

  console.log('paramssit', username, id);

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
    console.log('gamei data', gameData);
    // const game = games.find((game) => game.id === Number(id));
  }, [id, username]);

  console.log('gamei data', gameData);

  const handleHeartClick = async () => {
    try {
      const updatedHeart = await gameService.heartClick(gameData.id, {
        ...gameData,
        heart: true,
      });

      console.log('The response of the heart ', updatedHeart);
      setGameData(updatedHeart);
      setActive(updatedHeart.heart);

      if (onUpdateGame) {
        onUpdateGame(updatedHeart);
      }
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

  if (gameData) {
    return (
      <>
        <div>
          <h10>
            back to <Link to={`/${username}`}>{username}</Link> home page
          </h10>
        </div>
        <div style={styles.gameContainer}>
          <div style={styles.gameInfo}>
            <h2>{gameData.whole_title}</h2>

            <p style={{ width: '4rem' }}>
              <Heart isActive={active || false} onClick={handleHeartClick} />
            </p>
            {gameData.genres && <h3>Genres: {gameData.genres}</h3>}
            <h3>
              {new Date(gameData.release_date * 1000).toLocaleDateString()}
            </h3>

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
                  <span>5</span>
                  <span>10</span>
                </div>
              </div>
            ) : null}
          </div>
          <div style={styles.thumbNailContainer}>
            <p>
              <a href={gameData.url} target="blank" rel="noopener noreferrer">
                IGDB
              </a>
            </p>
            <img
              src={gameData.thumbnail.replace(/t_thumb/, 't_cover_big')}
              style={styles.thumbnail}
            />
            {gameData.rating ? (
              <div>
                <div style={styles.circle}>
                  <span style={styles.circleText}>{gameData.rating}</span>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </>
    );
  } else {
    return <div>Not found</div>;
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
    marginRight: '100px',
  },
  thumbNailContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  thumbnail: {
    width: '250px',
    height: '300px',
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
    // color: '#fff',
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

export default Game;
