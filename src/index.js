import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux'
import { createStore, combineReducers } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension';

import registerServiceWorker from './registerServiceWorker';

import App from './App';
import './css/app.css';

import store from './store'
import { connect } from './reducers/client-api'

// store.dispatch(connect('ws://localhost:8080/v1/json/socket', true));
ReactDOM.render(<Provider store={store} ><App /></Provider>, document.getElementById('root'));
registerServiceWorker();
