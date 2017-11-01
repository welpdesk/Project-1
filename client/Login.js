import React, { Component } from 'react'

class Login extends Component {
  constructor(props){
    super(props)
  }

  render(){
    return(
      <div>
      <input type='text' name='username' placeholder='username' onChange={this.props.onUsernameChange}></input>
      <input type='password' name='password' placeholder='password' onChange={this.props.onPasswordChange} ></input>
      <button onClick={this.props.logIntoPage}> Sign In</button>
      </div>
    )
  }
}
export default Login