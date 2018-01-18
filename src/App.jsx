import React, {Component} from 'react';
import {Router, Route} from 'react-router-dom';
import {connect} from 'react-redux';

import Notifications from 'react-notification-system-redux';
import history from './history'

const NotificationComponent = (props) => {
  return (<Notifications notifications={props.notifications}/>);
};

const NotificationContainer = connect(state => ({notifications: state.notifications}))(NotificationComponent)

class App extends Component {
  render() {
    return (
      <Router history={history}>
        <div>
          <NotificationContainer/>
        </div>
      </Router>
    );
  }
}

export default App;
