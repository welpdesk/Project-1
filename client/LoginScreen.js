import React from 'react'
import ReactDOM from 'react-dom'
import Login from './Login'

const LoginScreen =()=>{
    return (
        <div class="loginWindow">
            <Login/>
        </div>
    )
}

ReactDOM.render(
    <LoginScreen/>,
    document.getElementById('root')
)