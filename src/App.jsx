import React, {Component} from 'react';
import {Router, Route} from 'react-router-dom';
import {connect} from 'react-redux';

import history from './history'

class App extends Component {
  render() {
    return (
      <Router history={history}>
      <div></div>
      </Router>
    );
  }
}

export default App;
