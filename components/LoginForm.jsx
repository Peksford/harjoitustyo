import React from 'react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUser, userLogin } from '../reducers/loginReducer';
import PropTypes from 'prop-types';
import { Form, Button } from 'react-bootstrap';
import albumService from '../services/albums';
import movieService from '../services/movies';
import bookService from '../services/books';
import gameService from '../services/games';
import followService from '../services/follow';
import { useNavigate } from 'react-router-dom';

import { setNotification } from '../reducers/notificationReducer';

const ErrorMessage = ({ message }) => {
  if (message === null) {
    return null;
  }

  return <div className="error">{message}</div>;
};

const LoginForm = () => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await dispatch(userLogin(username, password));
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user));
      albumService.setToken(user.token);
      movieService.setToken(user.token);
      bookService.setToken(user.token);
      gameService.setToken(user.token);
      followService.setToken(user.token);

      dispatch(setUser(user));

      setUsername('');
      setPassword('');
      navigate(`/${username}`);
      dispatch(setNotification(`Welcome ${user.username}!`, 5));
    } catch (exception) {
      console.error(exception);
      setErrorMessage(exception.response.data.error);
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  handleLogin.propTypes = {
    username: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
  };

  ErrorMessage.propTypes = {
    message: PropTypes.string,
  };

  return (
    <div className="container">
      <h2>Log in to page</h2>
      <ErrorMessage message={errorMessage} />
      <Form onSubmit={handleLogin}>
        <Form.Group>
          <Form.Label>username: </Form.Label>
          <Form.Control
            id="username"
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
          <div></div>
          <Form.Label>password: </Form.Label>
          <Form.Control
            id="password"
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
          <div></div>
          <Button variant="primary" id="login-button" type="submit">
            login
          </Button>
        </Form.Group>
      </Form>
    </div>
  );
};

export default LoginForm;
