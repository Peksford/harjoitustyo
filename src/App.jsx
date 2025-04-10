import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import albumService from './services/albums';
import userService from './services/users';
import movieService from './services/movies';
import logoutService from './services/logout';
import bookService from './services/books';
import gameService from './services/games';
import groupService from './services/groups';
import followService from './services/follow';
import commentService from './services/comments';
import Notification from './components/Notification';
import Home from './components/Home';
import Profile from './components/Profile';
import Search from './components/Search';
import LoginForm from './components/LoginForm';
import MyList from './components/MyList';
import MyListBooks from './components/MyListBooks';
import MyListMovies from './components/MyListMovies';
import MyListGames from './components/MyListGames';
import Album from './components/Album';
import Movie from './components/Movie';
import Book from './components/Book';
import Game from './components/Game';
import Followers from './components/Followers';
import Following from './components/Following';
import SignUp from './components/SignUp';
import Group from './components/Group';
import UserGroup from './components/UserGroup';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from './reducers/loginReducer';
import { setNotification } from './reducers/notificationReducer';
import { useNavigate } from 'react-router-dom';
import { setAlbums, addAlbum } from './reducers/albumReducer';
import { setBooks, addBook } from './reducers/bookReducer';
import { setMovies, addMovie } from './reducers/movieReducer';
import { setGames, addGame } from './reducers/gameReducer';
import { setGroups } from './reducers/groupReducer';
import PropTypes from 'prop-types';
import Logo from './assets/Logo.png';
import { BsSearch, BsList } from 'react-icons/bs';
import { IoPersonCircleOutline } from 'react-icons/io5';
import { MdOutlineLogin } from 'react-icons/md';
import { GrGroup } from 'react-icons/gr';

const styles = {
  // padding: {
  //   padding: '0 10px',
  // },
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: '5px',

    // top: 0,
    // right: 0,
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
};

const ErrorMessage = ({ message }) => {
  if (message === null) {
    return null;
  }

  return <div className="error">{message}</div>;
};

ErrorMessage.propTypes = {
  message: PropTypes.string,
};

const App = () => {
  const user = useSelector((state) => state.user);
  const [errorMessage, setErrorMessage] = useState(null);
  const userAlbums = useSelector((state) => state.albums);
  const userBooks = useSelector((state) => state.books);
  const userMovies = useSelector((state) => state.movies);
  const userGames = useSelector((state) => state.games);
  // const userGroups = useSelector((state) => state.groups);
  const [pageLoaded, setPageLoaded] = useState(false);

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
        userService.setToken(user.token);
        groupService.setToken(user.token);
        commentService.setToken(user.token);
      } catch (error) {
        console.error('Error', error);
      }
    }
  }, [dispatch]);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        if (user) {
          const albums = await userService.getUserAlbums(user.username);
          const books = await userService.getUserBooks(user.username);
          const movies = await userService.getUserMovies(user.username);
          const games = await userService.getUserGames(user.username);
          const groups = await userService.getUserGroups(user.username);

          dispatch(setAlbums(albums));
          dispatch(setBooks(books));
          dispatch(setMovies(movies));
          dispatch(setGames(games));
          dispatch(setGroups(groups));
        }
      } catch (error) {
        console.error('error', error);
      }
    };
    fetchAlbums();
  }, [dispatch, user]);

  useEffect(() => {
    setPageLoaded(false);
    const timer = setTimeout(() => {
      setPageLoaded(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  const albumRatingUpdate = (updatedAlbum) => {
    console.log('aynthing here?', updatedAlbum);
    setAlbums((preAlbums) =>
      preAlbums.map((album) =>
        album.id === updatedAlbum.id ? updatedAlbum : album
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
    setGames((preGames) =>
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

  const createObject = async (newObject) => {
    try {
      let userObjects = [];
      if (newObject.type === 'album') userObjects = userAlbums;
      else if (newObject.type === 'book') userObjects = userBooks;
      else if (newObject.type === 'movie' || newObject.type === 'tv')
        userObjects = userMovies;
      else if (newObject.type === 'game') userObjects = userGames;

      const alreadyExists = userObjects.some((object) => {
        const sameTitle =
          object.title.toLowerCase() === newObject.title.toLowerCase();
        const sameYear =
          object.year !== undefined &&
          newObject.year !== undefined &&
          Number(object.year) === Number(newObject.year);

        return (
          sameTitle &&
          (object.year === undefined ||
            newObject.year === undefined ||
            sameYear)
        );
      });
      if (alreadyExists) {
        setErrorMessage(`'${newObject.title}' already added into your list`);
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
        return null;
      }
      if (newObject.type === 'album') {
        const newItem = await dispatch(addAlbum(newObject));
        dispatch(setNotification(`${newObject.title} added on your list`, 5));
        return newItem;
      } else if (newObject.type === 'book') {
        const newItem = await dispatch(addBook(newObject));
        dispatch(setNotification(`${newObject.title} added on your list`, 5));

        return newItem;
      } else if (newObject.type === 'movie' || newObject.type === 'tv') {
        const newItem = await dispatch(addMovie(newObject));
        dispatch(setNotification(`${newObject.title} added on your list`, 5));
        return newItem;
      } else if (newObject.type === 'game') {
        const newItem = await dispatch(addGame(newObject));
        dispatch(setNotification(`${newObject.title} added on your list`, 5));
        return newItem;
      }
    } catch (error) {
      console.error('Error adding an object', error);
      setErrorMessage(error.message);
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  return (
    <div>
      <Notification />
      <ErrorMessage message={errorMessage} />
      <div style={styles.container}>
        <Link to={`/`} style={{ textDecoration: 'none' }}>
          <img
            src={Logo}
            alt="Logo"
            style={{ width: '100%', maxWidth: '120px', height: 'auto' }}
          />
        </Link>
        {!user && (
          <Link style={styles.padding} to="/signup">
            Sign up
          </Link>
        )}
        <div style={styles.rightSection}>
          <Link style={styles.padding} to="/search">
            <BsSearch data-testid="search-button" />
          </Link>
          <Link style={styles.padding} to="/clubs">
            <GrGroup />
          </Link>
          {!user && (
            <Link style={styles.padding} to="/login">
              Login
            </Link>
          )}
          {user && (
            <div>
              <DropdownButton
                id="dropdown-secondary-button"
                data-testid="dropdown-list"
                title={<BsList />}
              >
                <Dropdown.Item as={Link} to={`/${user.username}`}>
                  <IoPersonCircleOutline /> {user.username}
                </Dropdown.Item>
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
                <Dropdown.Item onClick={handleLogout}>
                  <MdOutlineLogin /> Logout
                </Dropdown.Item>
              </DropdownButton>
            </div>
          )}
        </div>
      </div>

      <Routes>
        {
          // user === null ? (
          //   <Route path="*" element={<p>Loading...</p>} />
          // ) :
          user && (
            <>
              <Route
                path="/"
                element={<Profile createObject={createObject} />}
              />
            </>
          )
          // ) : (
          //   <Route path="*" element={<Navigate to="/login" replace />} />
          // )
        }
        <Route
          path="/search"
          element={<Search createObject={createObject} />}
        />
        <Route path="/login" element={<LoginForm />} />
        {user ? <Route path="/:username/albums" element={<MyList />} /> : null}
        {user ? (
          <Route path="/:username/books" element={<MyListBooks />} />
        ) : null}
        {user ? (
          <Route
            path="/:username/movies"
            element={user ? <MyListMovies /> : <Navigate to="/login" />}
          />
        ) : null}
        {user ? (
          <Route
            path="/:username/games"
            element={user ? <MyListGames /> : <Navigate to="/login" />}
          />
        ) : null}
        {user ? (
          <Route
            path="/:username/followers"
            element={user ? <Followers /> : <Navigate to="/login" />}
          />
        ) : null}
        {user ? (
          <Route
            path="/:username/following"
            element={user ? <Following /> : <Navigate to="/login" />}
          />
        ) : null}
        <Route
          path="/:username/albums/:id"
          element={
            <Album
              onUpdateAlbum={albumRatingUpdate}
              createAlbum={createObject}
            />
          }
        />
        <Route
          path="/:username/books/:id"
          element={
            <Book onUpdateBook={bookRatingUpdate} createBook={createObject} />
          }
        />
        <Route
          path="/:username/movies/:id"
          element={
            <Movie
              onUpdateMovie={movieRatingUpdate}
              createMovie={createObject}
            />
          }
        />
        <Route
          path="/:username/games/:id"
          element={
            <Game onUpdateGame={gameRatingUpdate} createGame={createObject} />
          }
        />
        <Route
          path="/:username"
          element={<Home createObject={createObject} />}
        />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/clubs" element={<Group />} />
        <Route
          path="/clubs/:id"
          element={
            <UserGroup
              createAlbum={createObject}
              onUpdateGroup={albumRatingUpdate}
            />
          }
        />
      </Routes>
      {/* {((userAlbums.length > 1) ||
        userMovies.length > 1 ||
        userBooks.length > 1 ||
        userGames.length > 1) && ( */}
      {pageLoaded ? (
        <footer className="footer">
          This website uses TMDB and the TMDB APIs but is not endorsed,
          certified, or otherwise approved by TMDB.
        </footer>
      ) : null}
    </div>
  );
};

export default App;
