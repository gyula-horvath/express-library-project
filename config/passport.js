const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const bcrypt = require('bcryptjs');

module.exports = function(passport) {
  // Local Strategy
  passport.use(new LocalStrategy(function(username, password, done) {
    //Match Username
    console.log("searching for user...");
    let query = {username: username};
    User.findOne(query, function(err, user) {
      if(err) throw err;
      if(!user) {
        console.log("not a user");
        return done(null, false, {message: 'Incorrect username'});
      }
      console.log("User found.");
      //Match Password
      bcrypt.compare(password, user.password, function(err, isMatch){
        console.log("Comparing passwords...")
        if(err) throw err;
        if(isMatch){
          return done(null, user);
        } else {
          console.log("Wrong password");
          return done(null, false, {message: 'Wrong password'});
        }
      });
    });
  }));

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
};