'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

//defining attributes on userSchema
const userSchema = new Schema({
    nameFirst: { type: String, required: true},
    nameLast: { type: String, required: true},
    handle: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    sessionId : { type: String, Index: true, Unique:true }
})

const User = mongoose.model('User',userSchema);

userSchema.methods.createUser = (body) => {

  const user = {};
  user.nameFirst = body.firstname;
  user.nameLast = body.lastname;
  user.handle = body.username;
  user.email = body.email;
  bcrypt.hash(body.password, SALT_ROUNDS, function(err, hash) {
    // Store hash in your password DB.
    user.password = hash;

    User.create(user, (err, result) => {
      if (err) console.log(err);
      else console.log(result);
    });
  });
}

userSchema.methods.verifyPassword = (password) => {
    User.findOne({handle: this.handle}, (err, user) => {
      if (err) console.log(err);
      else {
        bcrypt.compare(password, user.password).then(function(res) {
          // res == true
          return res;
      });
      }
    });
}

module.exports = User;

/*

	"nameFirst": "javi",
    "nameLast": "air",
    "handle": "hobbyair",
    "email": "@hyeah",
    "password": "password",
    "sessionId" : "sessionId"*/