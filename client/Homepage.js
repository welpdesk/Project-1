import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import List from './List'
import Searchbar from './Searchbar'

const Homepage = () => {
    return (
        <div className="Homepage">
            <Searchbar />
            <List title ={'Relevant Jobs'}/>
            <List title = {'You have Applied To These Jobs:'}/>
        </div>
    )
}


 module.exports = Homepage;