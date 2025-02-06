import React from 'react';
// // import { StrictMode } from 'react';
// import { Provider } from 'react-redux';
// // import { createRoot } from 'react-dom/client';
import './styles.css';
// import App from './App.jsx';
// import store from './store';

import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import store from './store';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
);
