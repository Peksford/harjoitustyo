import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  BrowserRouter as Router,
  Link,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { useState, useEffect } from 'react';
import albumService from '../services/albums';
import movieService from '../services/movies';
import logoutService from '../services/logout';
import bookService from '../services/books';
import gameService from '../services/games';
import followService from '../services/follow';
import Notification from '../components/Notification';
import Home from '../components/Home';
import Search from '../components/Search';
import LoginForm from '../components/LoginForm';
import MyList from '../components/MyList';
import MyListBooks from '../components/MyListBooks';
import MyListMovies from '../components/MyListMovies';
import MyListGames from '../components/MyListGames';
import Album from '../components/Album';
import Movie from '../components/Movie';
import Book from '../components/Book';
import Game from '../components/Game';
import Followers from '../components/Followers';
import Following from '../components/Following';
import SignUp from '../components/SignUp';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../reducers/loginReducer';
import { setNotification } from '../reducers/notificationReducer';
import { useNavigate } from 'react-router-dom';

const styles = {
  padding: {
    padding: 3,
  },
  container: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
};

const App = () => {
  const [albums, setAlbums] = useState([]);
  const [books, setBooks] = useState([]);
  const [movies, setMovies] = useState([]);
  const [games, setGames] = useState([]);
  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
    if (loggedUserJSON) {
      try {
        const user = JSON.parse(loggedUserJSON);
        dispatch(setUser(user));
        albumService.setToken(user.token);
        bookService.setToken(user.token);
        movieService.setToken(user.token);
        gameService.setToken(user.token);
        followService.setToken(user.token);
      } catch (error) {
        console.error('Error', error);
      }
    }
  }, [dispatch]);

  const albumRatingUpdate = (updatedAlbum) => {
    setAlbums((preAlbums) =>
      preAlbums.map((album) =>
        album.id === updatedAlbum.id ? updatedAlbum : { ...album, heart: false }
      )
    );
  };

  const bookRatingUpdate = (updatedBook) => {
    setBooks((preBooks) =>
      preBooks.map((book) => (book.id === updatedBook.id ? updatedBook : book))
    );
  };

  const movieRatingUpdate = (updatedMovie) => {
    setMovies((preMovies) =>
      preMovies.map((movie) =>
        movie.id === updatedMovie.id ? updatedMovie : movie
      )
    );
  };

  const gameRatingUpdate = (updatedGame) => {
    setMovies((preGames) =>
      preGames.map((game) => (game.id === updatedGame.id ? updatedGame : game))
    );
  };

  const handleLogout = async (event) => {
    event.preventDefault();

    try {
      await logoutService.logout(user.username);
    } catch (error) {
      console.error(error);
    }

    window.localStorage.removeItem('loggedBlogappUser', JSON.stringify(user));

    dispatch(setUser(null));
    dispatch(setNotification(`Logged out user ${user.username}`, 5));
    navigate('/login');
  };

  const createAlbum = async (albumObject) => {
    const newAlbum = await albumService.create(albumObject);
    setAlbums([...albums, newAlbum]);
  };

  const createMovie = async (movieObject) => {
    const newMovie = await movieService.create(movieObject);
    setMovies([...movies, newMovie]);
  };

  const createBook = async (bookObject) => {
    const newBook = await bookService.create(bookObject);
    setBooks([...books, newBook]);
  };

  const createGame = async (gameObject) => {
    const newGame = await gameService.create(gameObject);
    setGames([...books, newGame]);
  };

  return (
    <div>
      <Notification />

      <div style={styles.container}>
        {user ? (
          <Link style={styles.padding} to={`/${user.username}`}>
            {user.username}
          </Link>
        ) : (
          <Link style={styles.padding} to="/signup">
            Sign up
          </Link>
        )}
        <Link style={styles.padding} to="/search">
          Search
        </Link>
        {!user && (
          <Link style={styles.padding} to="/login">
            login
          </Link>
        )}
        {user && (
          <DropdownButton id="dropdown-basic-button" title={user.username}>
            <Dropdown.Item as={Link} to={`/${user.username}/albums`}>
              My albums
            </Dropdown.Item>
            <Dropdown.Item as={Link} to={`/${user.username}/movies`}>
              My movies
            </Dropdown.Item>
            <Dropdown.Item as={Link} to={`/${user.username}/books`}>
              My books
            </Dropdown.Item>
            <Dropdown.Item as={Link} to={`/${user.username}/games`}>
              My games
            </Dropdown.Item>
          </DropdownButton>
        )}
        {user && <button onClick={handleLogout}> Logout</button>}
      </div>
      <Routes>
        <Route path="/" element={user ? <Home /> : <Navigate to="/signup" />} />
        <Route
          path="/search"
          element={
            <Search
              createAlbum={createAlbum}
              createBook={createBook}
              createMovie={createMovie}
              createGame={createGame}
            />
          }
        />
        <Route path="/login" element={<LoginForm />} />
        {user ? (
          <Route path="/:username/albums" element={<MyList user={user} />} />
        ) : null}
        {user ? (
          <Route
            path="/:username/books"
            element={<MyListBooks books={books} user={user} />}
          />
        ) : null}
        {user ? (
          <Route
            path="/:username/movies"
            element={
              user ? (
                <MyListMovies movies={movies} user={user} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        ) : null}
        {user ? (
          <Route
            path="/:username/games"
            element={
              user ? (
                <MyListGames games={games} user={user} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        ) : null}
        {user ? (
          <Route
            path="/:username/followers"
            element={
              user ? <Followers user={user} /> : <Navigate to="/login" />
            }
          />
        ) : null}
        {user ? (
          <Route
            path="/:username/following"
            element={
              user ? <Following user={user} /> : <Navigate to="/login" />
            }
          />
        ) : null}
        <Route
          path="/:username/albums/:id"
          element={
            <Album
              user={user}
              albums={albums}
              onUpdateAlbum={albumRatingUpdate}
            />
          }
        />
        <Route
          path="/:username/books/:id"
          element={<Book user={user} onUpdateBook={bookRatingUpdate} />}
        />
        <Route
          path="/:username/movies/:id"
          element={
            <Movie
              user={user}
              movies={movies}
              onUpdateMovie={movieRatingUpdate}
            />
          }
        />
        <Route
          path="/:username/games/:id"
          element={
            <Game user={user} games={games} onUpdateGame={gameRatingUpdate} />
          }
        />
        <Route path="/:username" element={<Home user={user} />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </div>
  );
};

export default App;
