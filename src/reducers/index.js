import {combineReducers} from 'redux'
import {reducer as notifications} from 'react-notification-system-redux';

const reducers = combineReducers({notifications});

export default reducers;