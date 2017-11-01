const User = require('../db/userModel');
const path = require('path');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

const userController = {};

userController.getUserInfo = (req, res) => {
  User.find(function (err, itms) {
    if (err) return res.send(err);
    console.log(itms);
    res.send(itms);
  });
}

userController.createUser = (req, res) => {
  /* * * * * 
    Retrieving the needed properties from the response object and adding to an object
    Hashing password
    Creating user document in DB with user object
  * * * * */
  const user = {};
  user.nameFirst = req.body.firstname;
  user.nameLast = req.body.lastname;
  user.handle = req.body.username;
  user.email = req.body.email;
  bcrypt.hash(req.body.password, SALT_ROUNDS, function(err, hash) {
    // Store hash in your password DB.
    if (err) console.log(err);

    user.password = hash;

    User.create(user, (err, result) => {
      if (err) return res.status(404).send('error '+ err);
      return res.send(result);
    });
  });
}

/* * * * * 
  Verifies that the plain text password 'password' is equal to the actual password 'user.password'
  Bcrypt will hash 'password' and compare to 'user.password' which is the original password - hashed from our DB
* * * * */
userController.verifyPassword = (user, password) => {
  return bcrypt.compareSync(password, user.password);
}


userController.findUser = (req, res, next) =>{
    console.log('userController.findUser = (req, res, next) ', Date());
    
    // console.log('req.body',req.body);
    console.log(req.headers);
    console.log(req);
    
    User.findOne({'handle':req.body.handle}, (err, result) => {
            console.log(result);
            console.log('req.body',req.body);
          if(err) return res.status(404).send('database error');
          if(result){
            if(req.body.password===result.password){
                console.log("password matches", Date())
                next();
            }else{
                console.log("no password match", Date())
            }
          }else{
              console.log("no user found", Date());
          }
            // return res.send(result);//give me the get request name of the student I'm finding
        });
}
module.exports = userController;