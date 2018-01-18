import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension';

import {clientApiMiddleware, notificationMiddleware} from './reducers/client-api'
import reducers from './reducers'

const store = createStore(reducers, composeWithDevTools(), applyMiddleware(clientApiMiddleware, notificationMiddleware));

export default store

