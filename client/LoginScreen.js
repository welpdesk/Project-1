import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import Login from './Login'

class LoginScreen extends Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
        <div className="loginWindow">
            <h1>Log in</h1>
            <Login logIntoPage={this.props.logIntoPage} onPasswordChange={this.props.onPasswordChange} onUsernameChange={this.props.onUsernameChange}/>
        </div> 
        )
    }
}

export default LoginScreen;