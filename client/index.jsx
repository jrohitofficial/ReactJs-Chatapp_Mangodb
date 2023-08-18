import React from 'react';
// React 18x root APIs
import * as ReactDOM from 'react-dom/client';
// redux
import { Provider } from 'react-redux';
import store from './redux/store';
import App from './app';

const root = ReactDOM.createRoot(document.querySelector('#root'));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
