import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Redirect } from 'react-router-dom';

class PrivateRoute extends Component {
  render() {
    return (
      <Route render={ props => { return ((this.props.isAuth) ? <this.props.component {...this.props}/> : <Redirect to='/' />) } } />
    );
  }
}

export default PrivateRoute;