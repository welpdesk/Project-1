const User = require('../db/userModel');
const path = require('path');

const userController = {};

userController.getUserInfo = (req, res) => {
    User.find(function (err, itms) {
        if (err) return res.send(err);
        console.log(itms);
        res.send(itms);

    });

}

userController.createUser = (req, res) => {
    console.log(req.body);
    User.create(req.body, (err, result) => {//<---req.body is an object passing in julie is the same thing as req.body.
        if (err) return res.status(404).send('error '+ err);
        console.log(result);
        return res.send(result);
    });
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