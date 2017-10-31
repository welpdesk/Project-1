import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import List from './List'

const Homepage = () => {
    return (
        <div className="Homepage">
            <List title ={'Relevant Jobs'}/>
            <List title = {'You have Applied To These Jobs:'}/>
        </div>
    )
}


 module.exports =Homepage;