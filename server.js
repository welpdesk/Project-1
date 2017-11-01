"use strict"
const express = require('express');
const appl = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userController = require('./controllers/userController');
const searchController = require('./controllers/searchController');
const path = require('path');
const fetch = require('node-fetch');
const passport = require('./passport.js');
/* * * * * 
  Express session makes the session object accessible to by putting it on the request object as req.session (json object)
  This object is persisted throughout the application
* * * * */
const session = require('express-session');


// appl.use(bodyParser());
appl.use(bodyParser.urlencoded({ extended: false }));
appl.use(bodyParser.json());
appl.use(session({
  secret: 'yooo',
  resave: true,
  saveUninitialized: true,
}));
appl.use(passport.initialize());
appl.use(passport.session());

//mongoose.connect('mongodb://10.42.69.251/local', () => {
//mongodb://<dbuser>:<dbpassword>@ds141175.mlab.com:41175/glassdoorscrape
mongoose.connect('mongodb://jolaya182:marieo23@ds141175.mlab.com:41175/glassdoorscrape', () => {	
    console.log('Connected with javis mongo.js');
});
appl.use(express.static('./build'));

//duplicate of appl.get not necessary but another way of writing line 21
// appl.get('/login',  (req, res)=>{res.sendFile(path.join(__dirname , '../static/login.html'))} );

/* * * * * 
  Server routing for authentication
* * * * */

appl.post('/login', passport.authenticate('local', { successRedirect: '/success', failureRedirect: '/failure' }));

appl.get('/success', (req, res) => {
  console.log('inside the server /succes')
  let successResp = {
    message : 'Login Successful'
  }
  res.status(200).json(JSON.stringify(successResp));
});

appl.get('/failure', (req, res) => {
  let successResp = {
    message : 'Login Failed'
  }
  res.status(401).json(JSON.stringify(successResp));
});

const User = require('./db/userModel.js');

appl.post('/signup', userController.createUser);






//appl.get('/', (req, res, next) => {console.log('req.body', req.body) ;next();},(req, res)=>{res.sendFile(path.join(__dirname , '../static/index.html'))});
//appl.get('/register',(req, res)=>{res.sendFile(path.join(__dirname , '../static/register.html'))});
appl.post('/', userController.createUser);
appl.post('/search', (req, res, next) => {console.log('req.body', req.body) ;next();}, userController.findUser, searchController.home);
/*appl.get('/addItem',  (req, res)=>{res.sendFile(path.join(__dirname , '../static/additem.html'))} );
*/
appl.get("/searchBar", searchController.searchBar  );
appl.post("/results", searchController.results  );


// ensures that all routes are to be handled by REACT
appl.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './build/index.html'));
});



appl.listen(3000, ()=>{console.log("listening to port 3000") });
