import React from 'react';
import { Form, Button } from 'react-bootstrap';
import { useState } from 'react';
import userService from '../services/users';
import { useDispatch } from 'react-redux';
import { setUser, userLogin } from '../reducers/loginReducer';
import albumService from '../services/albums';
import movieService from '../services/movies';
import bookService from '../services/books';
import gameService from '../services/games';
import followService from '../services/follow';
import groupService from '../services/groups';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import Logo from '../assets/Logo.png';

import {
  notificationHide,
  notificationShow,
} from '../reducers/notificationReducer';

const ErrorMessage = ({ message }) => {
  if (message === null) {
    return null;
  }

  return <div className="error">{message}</div>;
};

const SignUp = () => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  const handleSignUp = async (event) => {
    event.preventDefault();

    try {
      await userService.newUser({ username, name, password });
      const user = await dispatch(userLogin(username, password));
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user));
      albumService.setToken(user.token);
      movieService.setToken(user.token);
      bookService.setToken(user.token);
      gameService.setToken(user.token);
      followService.setToken(user.token);
      userService.setToken(user.token);
      groupService.setToken(user.token);
      dispatch(setUser(user));

      dispatch(notificationShow(`Welcome ${user.username}!`));

      setTimeout(() => dispatch(notificationHide('')), 5000);

      navigate('/');
    } catch (error) {
      console.error(error);
      setErrorMessage('This username is already taken');
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  return (
    <div className="login-container">
      <div style={{ textAlign: 'center', marginTop: '10%' }}>
        <h1>
          <img
            src={Logo}
            alt="Logo"
            style={{ width: '100%', maxWidth: '300px', height: 'auto' }}
          />
        </h1>
        Keep track of your favorite books, movies, music, and games—all in one
        place. Easily browse your ratings, discover new favorites, and compare
        with friends. Sign up now and start building your collection!
      </div>
      <h2>Sign up</h2>
      <ErrorMessage message={errorMessage} />
      <Form onSubmit={handleSignUp}>
        <Form.Group>
          <Form.Label>Username: </Form.Label>
          <Form.Control
            id="username"
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
          <div></div>
          <Form.Label>Password: </Form.Label>
          <Form.Control
            id="password"
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
          <div></div>
          <Button
            className="black-button"
            variant="primary"
            id="login-button"
            type="submit"
          >
            Sign up
          </Button>
        </Form.Group>
      </Form>
    </div>
  );
};

ErrorMessage.propTypes = {
  message: PropTypes.string,
};

export default SignUp;
