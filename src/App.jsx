// import { useState } from 'react';
// import reactLogo from './assets/react.svg';
// import viteLogo from '/vite.svg';
// import './App.css';
// import ReactDOM from 'react-dom/client';
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
import userService from '../services/users';
import logoutService from '../services/logout';
import bookService from '../services/books';
import gameService from '../services/games';

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
import SignUp from '../components/SignUp';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../reducers/loginReducer';

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
  const [open, setOpen] = useState(false);
  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();

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
      } catch (error) {
        console.error('Error', error);
      }
    }
  }, [dispatch]);

  useEffect(() => {
    const fetchUserAlbums = async () => {
      if (user && user.username)
        try {
          const userAlbumsData = await userService.getUserAlbums(user.username);
          setAlbums(userAlbumsData);
        } catch (error) {
          console.error('error fetching albums: ', error);
        }
    };
    fetchUserAlbums();
  }, [user]);

  const albumRatingUpdate = (updatedAlbum) => {
    setAlbums((preAlbums) =>
      preAlbums.map((album) =>
        album.id === updatedAlbum.id ? updatedAlbum : { ...album, heart: false }
      )
    );
  };

  useEffect(() => {
    const fetchUserBooks = async () => {
      if (user && user.username)
        try {
          const userBooksData = await userService.getUserBooks(user.username);
          console.log('userbbdfokbdfs', userBooksData);
          setBooks(userBooksData);
        } catch (error) {
          console.error('error fetching albums: ', error);
        }
    };
    fetchUserBooks();
  }, [user]);

  const bookRatingUpdate = (updatedBook) => {
    setBooks((preBooks) =>
      preBooks.map((book) => (book.id === updatedBook.id ? updatedBook : book))
    );
  };

  useEffect(() => {
    const fetchUserMovies = async () => {
      if (user && user.username)
        try {
          const userMoviesData = await userService.getUserMovies(user.username);
          setMovies(userMoviesData);
        } catch (error) {
          console.error('error fetching movies: ', error);
        }
    };
    fetchUserMovies();
  }, [user]);

  const movieRatingUpdate = (updatedMovie) => {
    setMovies((preMovies) =>
      preMovies.map((movie) =>
        movie.id === updatedMovie.id ? updatedMovie : movie
      )
    );
  };

  useEffect(() => {
    const fetchUserGames = async () => {
      if (user && user.username)
        try {
          const userGamesData = await userService.getUserGames(user.username);
          setMovies(userGamesData);
        } catch (error) {
          console.error('error fetching movies: ', error);
        }
    };
    fetchUserGames();
  }, [user]);

  const gameRatingUpdate = (updatedGame) => {
    setMovies((preGames) =>
      preGames.map((game) => (game.id === updatedGame.id ? updatedGame : game))
    );
  };

  const handleLogout = async (event) => {
    event.preventDefault();
    console.log('logging out with', user);
    try {
      await logoutService.logout(user.username);
    } catch (error) {
      console.error(error);
    }

    window.localStorage.removeItem('loggedBlogappUser', JSON.stringify(user));

    dispatch(setUser(null));
  };

  const createAlbum = async (albumObject) => {
    const newAlbum = await albumService.create(albumObject);
    setAlbums([...albums, newAlbum]);
  };

  const createMovie = async (movieObject) => {
    console.log('Movie object', movieObject);
    const newMovie = await movieService.create(movieObject);
    setMovies([...movies, newMovie]);
  };

  const createBook = async (bookObject) => {
    const newBook = await bookService.create(bookObject);
    setBooks([...books, newBook]);
  };

  const createGame = async (gameObject) => {
    console.log('game object', gameObject);
    const newGame = await gameService.create(gameObject);
    setGames([...books, newGame]);
  };

  const handleOpen = () => {
    setOpen(!open);
  };

  const handleMenuMyAlbums = () => {
    <Link style={styles.padding} to="/albums">
      My albums
    </Link>;
    setOpen(false);
  };

  return (
    <div>
      <Router>
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

          {/* 
          {user && (
            <Link style={styles.padding} to="/books">
              My books
            </Link>
          )}
          {user && (
            <Link style={styles.padding} to="/movies">
              My movies/TV
            </Link>
          )} */}
          {user && <button onClick={handleLogout}> Logout</button>}
        </div>
        <Routes>
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
          ) : // <Route path="/albums" element={<Navigate to="/login" />} />
          null}
          {user ? (
            <Route
              path="/:username/books"
              element={<MyListBooks books={books} user={user} />}
            />
          ) : // <Route path="/books" element={<Navigate to="/login" />} />
          null}
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
          ) : // <Route path="/movies" element={<Navigate to="/login" />} />
          null}
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
          ) : // <Route path="/movies" element={<Navigate to="/login" />} />
          null}
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
          <Route path="/:username" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
