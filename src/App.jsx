// import { useState } from 'react';
// import reactLogo from './assets/react.svg';
// import viteLogo from '/vite.svg';
// import './App.css';
// import ReactDOM from 'react-dom/client';

import { BrowserRouter as Router, Link, Routes, Route } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <h1>Peksford</h1>
    </div>
  );
};

const Music = () => {
  return (
    <div>
      <h1>Music</h1>
    </div>
  );
};

const Members = () => {
  return (
    <div>
      <h1>Members</h1>
    </div>
  );
};

const Tour = () => {
  return (
    <div>
      <h1>Tour</h1>
    </div>
  );
};

const padding = {
  padding: 3,
};

const App = () => {
  return (
    <div>
      <Router>
        <div>
          <Link style={padding} to="/">
            home
          </Link>
          <Link style={padding} to="/music">
            music
          </Link>
          <Link style={padding} to="/members">
            members
          </Link>
          <Link style={padding} to="/tour">
            tour
          </Link>
        </div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/music" element={<Music />} />
          <Route path="/members" element={<Members />} />
          <Route path="/tour" element={<Tour />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
