import { createStore, combineReducers, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension';
import config from './reducers/config'
import { clientApiMiddleware, notificationMiddleware } from './reducers/client-api'
import { initReducerMiddleware } from './reducers/reducers-middleware'
import reducers from './reducers'

const store = createStore(reducers, composeWithDevTools(), applyMiddleware(clientApiMiddleware, initReducerMiddleware(config), notificationMiddleware));

export default store

