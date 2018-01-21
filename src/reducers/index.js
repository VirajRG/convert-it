import { combineReducers } from 'redux'
import { reducer as notifications } from 'react-notification-system-redux';
import { createReducer } from './reducers-middleware'

const reducers = combineReducers({ notifications });

export default reducers;