// import { useState } from 'react';
// import reactLogo from './assets/react.svg';
// import viteLogo from '/vite.svg';
// import './App.css';
// import ReactDOM from 'react-dom/client';

import {
  BrowserRouter as Router,
  Link,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { useState, useEffect } from 'react';
import albumService from '../services/albums';
import userService from '../services/users';
import logoutService from '../services/logout';
import bookService from '../services/books';

import Home from '../components/Home';
import Search from '../components/Search';
import LoginForm from '../components/LoginForm';
import MyList from '../components/MyList';
import MyListBooks from '../components/MyListBooks';
import Album from '../components/Album';
import Book from '../components/Book';
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
      } catch (error) {
        console.error('Error', error);
      }
    }
  }, [dispatch]);

  console.log('User info', user);

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
        album.id === updatedAlbum.id ? updatedAlbum : album
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

  const BookRatingUpdate = (updatedBook) => {
    setBooks((preBooks) =>
      preBooks.map((book) => (book.id === updatedBook.id ? updatedBook : book))
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

  const createBook = async (bookObject) => {
    const newBook = await bookService.create(bookObject);
    setBooks([...books, newBook]);
  };

  console.log('user books', books);

  return (
    <div>
      <Router>
        <div style={styles.container}>
          {user ? (
            <Link style={styles.padding} to="/">
              {user.username}
            </Link>
          ) : (
            <Link style={styles.padding} to="/signup">
              home
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
            <Link style={styles.padding} to="/albums">
              albums
            </Link>
          )}
          {user && (
            <Link style={styles.padding} to="/books">
              books
            </Link>
          )}
          {user && <button onClick={handleLogout}> Logout</button>}
        </div>
        <Routes>
          <Route path="/" element={<Home albums={albums} user={user} />} />
          <Route
            path="/search"
            element={
              <Search createAlbum={createAlbum} createBook={createBook} />
            }
          />
          <Route path="/login" element={<LoginForm />} />
          {user ? (
            <Route
              path="/albums"
              element={<MyList albums={albums} user={user} />}
            />
          ) : (
            <Route path="/albums" element={<Navigate to="/login" />} />
          )}
          {user ? (
            <Route
              path="/books"
              element={<MyListBooks books={books} user={user} />}
            />
          ) : (
            <Route path="/books" element={<Navigate to="/login" />} />
          )}
          <Route
            path="/albums/:username/:id"
            element={
              <Album
                user={user}
                albums={albums}
                onUpdateAlbum={albumRatingUpdate}
              />
            }
          />
          <Route
            path="/books/:username/:id"
            element={<Book user={user} onUpdateBook={BookRatingUpdate} />}
          />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
