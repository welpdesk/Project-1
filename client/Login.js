import React, { Component } from 'react'

class Login extends Component {
  constructor(props){
    super(props)
    this.state = {value:'', password:''};
    this.handleChange = this.handleChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange (event)  {
    this.setState({value:event.target.value});
  }

  handlePasswordChange (event){
    this.setState({password: event.target.value});
  }
  
  handleSubmit (event){
    event.preventDefault();
  }
  render(){
    <form onSubmit={this.props.onSubmit}>
    <Input type='text' name='username' placeholder='username' />
    <Input type='password' name='password' placeholder='password' />
    <button> Sign In</button>
    </form>  
  }
}
export default Login