import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.jsx';
import registerServiceWorker from './registerServiceWorker';
import './css/app.css'
import { Provider } from 'react-redux'
import { composeWithDevTools } from 'redux-devtools-extension';
import { createStore, applyMiddleware } from 'redux'
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
