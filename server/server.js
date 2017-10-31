"use strict"
const express=require('express');
const appl=express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userController = require('../controllers/userController')
const searchController = require('../controllers/searchController')
const path = require('path');
const fetch = require('node-fetch');


// appl.use(bodyParser());
appl.use(bodyParser.urlencoded({ extended: false }));
 appl.use(bodyParser.json());

//mongoose.connect('mongodb://10.42.69.251/local', () => {
//mongodb://<dbuser>:<dbpassword>@ds141175.mlab.com:41175/glassdoorscrape
mongoose.connect('mongodb://jolaya182:marieo23@ds141175.mlab.com:41175/glassdoorscrape', () => {	
    console.log('Connected with javis mongo.js');
});
//appl.use(express.static('static'));

//duplicate of appl.get not necessary but another way of writing line 21
// appl.get('/login',  (req, res)=>{res.sendFile(path.join(__dirname , '../static/login.html'))} );
appl.get('/', (req, res, next) => {console.log('req.body', req.body) ;next();},(req, res)=>{res.sendFile(path.join(__dirname , '../static/index.html'))});
appl.get('/register',(req, res)=>{res.sendFile(path.join(__dirname , '../static/register.html'))});
appl.post('/', userController.createUser);
appl.post('/search', (req, res, next) => {console.log('req.body', req.body) ;next();}, userController.findUser, searchController.home);
/*appl.get('/addItem',  (req, res)=>{res.sendFile(path.join(__dirname , '../static/additem.html'))} );
*/
appl.get("/searchBar", searchController.searchBar  );
appl.post("/results", searchController.results  );


appl.listen(3000, ()=>{console.log("listening to port 3000") });
