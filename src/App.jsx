// import { useState } from 'react';
// import reactLogo from './assets/react.svg';
// import viteLogo from '/vite.svg';
// import './App.css';
// import ReactDOM from 'react-dom/client';

import { BrowserRouter as Router, Link, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import albumService from '../services/albums';
import userService from '../services/users';
import Home from '../components/Home';
import AlbumSearch from '../components/AlbumSearch';
import LoginForm from '../components/LoginForm';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../reducers/loginReducer';

const padding = {
  padding: 3,
};

const App = () => {
  const [albums, setAlbums] = useState([]);
  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
    if (loggedUserJSON) {
      try {
        const user = JSON.parse(loggedUserJSON);
        dispatch(setUser(user));
        albumService.setToken(user.token);
      } catch (error) {
        console.error('Error', error);
      }
    }
  }, [dispatch]);

  console.log('User', user);
  useEffect(() => {
    const getAlbums = async () => {
      try {
        const albumsData = await albumService.getAll();
        setAlbums(albumsData);
      } catch (error) {
        console.error('error fetching albums: ', error);
      }
    };
    getAlbums();
  }, []);

  const handleLogout = async (event) => {
    event.preventDefault();
    console.log('logging out with', user);

    window.localStorage.removeItem('loggedBlogappUser', JSON.stringify(user));

    dispatch(setUser(null));
  };

  return (
    <div>
      <Router>
        <div>
          <Link style={padding} to="/">
            home
          </Link>
          <Link style={padding} to="/search">
            search
          </Link>
          {!user && (
            <Link style={padding} to="/login">
              login
            </Link>
          )}
          {user && <button onClick={handleLogout}> Logout</button>}
        </div>
        <Routes>
          <Route path="/" element={<Home albums={albums} />} />
          <Route path="/search" element={<AlbumSearch />} />
          <Route path="/login" element={<LoginForm />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
