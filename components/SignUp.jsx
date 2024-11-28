import { Form, Button } from 'react-bootstrap';

const SignUp = () => {
  return (
    <div className="container">
      <h2>Log in to MusicBox!</h2>
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

export default SignUp;
