import React, {Component} from 'react';
import {connect} from 'react-redux';
import Notifications from 'react-notification-system-redux';

const NotificationComponent = (props) => {
  return (<Notifications notifications={props.notifications}/>);
};

const NotificationContainer = connect(state => ({notifications: state.notifications}))(NotificationComponent)

class App extends Component {
  render() {
    return (
      <div className="App">
        <NotificationContainer/>
      </div>
    );
  }
}

export default App;
