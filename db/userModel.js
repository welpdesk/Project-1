'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
module.exports = User;

/*

	"nameFirst": "javi",
    "nameLast": "air",
    "handle": "hobbyair",
    "email": "@hyeah",
    "password": "password",
    "sessionId" : "sessionId"*/