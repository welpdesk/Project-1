import React, { Component } from 'react';
import { BrowserRouter, Switch, Redirect, Route} from 'react-router-dom';
import ReactDOM from 'react-dom';
import Homepage from './Homepage';
import LoginScreen from './LoginScreen';
import PrivateRoute from './PrivateRoute.js';


class App extends Component {
  constructor() {
    super();

  }

  render () {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" render={ () => ( <LoginScreen /> ) } />
          <Route path="/register" render={ () => {} } />
          <PrivateRoute path="/home" component={Homepage} isAuth={true} />
        </Switch>
      </BrowserRouter>
    )
  };
} 


ReactDOM.render(
    < App />,
    document.getElementById('root')
);