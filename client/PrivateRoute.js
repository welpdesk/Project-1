import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Redirect } from 'react-router-dom';

class PrivateRoute extends Component {
  render() {
    console.log('inside of pRivate Route', this.props);
    return (
      <Route render={ props => { return ((this.props.isAuth) ?  <Redirect to='/home' /> : <Redirect from='/' to='/' />) } } />
    );
  }
}

export default PrivateRoute;