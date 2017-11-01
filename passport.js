const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./db/userModel.js');
const userController = require('./controllers/userController.js');

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
      done(err, user);
  });
});

passport.use(new LocalStrategy(
  function (username, password, done) {
    User.findOne({ handle: username }, function(err, user) {
      if (err) return done(err);
      if (!user) return done(null, false);
      if (!userController.verifyPassword(user, password)) return done(null, false);
      return done(null, user);
    });
  }
));

module.exports = passport;