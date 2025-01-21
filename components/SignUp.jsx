import { Form, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import userService from '../services/users';
import { useDispatch } from 'react-redux';
import { setUser, userLogin } from '../reducers/loginReducer';
import albumService from '../services/albums';
import movieService from '../services/movies';
import bookService from '../services/books';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (event) => {
    event.preventDefault();

    console.log('username', username);
    console.log('password', password);
    try {
      await userService.newUser({ username, name, password });
      const user = await dispatch(userLogin(username, password));
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user));
      albumService.setToken(user.token);
      movieService.setToken(user.token);
      bookService.setToken(user.token);
      dispatch(setUser(user));
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container">
      <h2>Sign Up to MusicBox!</h2>
      <Form onSubmit={handleSignUp}>
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
          {/* <Form.Label>name: </Form.Label>
          <Form.Control
            id="name"
            type="text"
            value={name}
            name="Name"
            onChange={({ target }) => setName(target.value)}
          />
          <div></div> */}
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

export default SignUp;
