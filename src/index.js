import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';

import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension';

import App from './App.jsx';
import './css/app.css'
import reducers from './reducers'
import {connect, clientApiMiddleware, notificationMiddleware} from './reducers/client-api'

let store = createStore(reducers, applyMiddleware(clientApiMiddleware, notificationMiddleware), composeWithDevTools());
// store.dispatch(connect('ws://localhost:8080/v1/client/json/socket', true));


ReactDOM.render(
    <Provider store={store}>
    <App />
    </Provider>, document.getElementById('root')
  );

registerServiceWorker();
