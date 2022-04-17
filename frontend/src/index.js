import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {createCard} from "./state/cardStore";
import Card from "./state/Card";

const root = ReactDOM.createRoot(document.getElementById('root'));
// remove on production
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();


createCard(new Card(1, 2, 3, 4))
createCard(new Card(2, 5, 3, 4))
createCard(new Card(3, 8, 3, 4))
createCard(new Card(4, 12, 3, 4))
createCard(new Card(5, 15, 3, 4))
