const User = require('../models/user');
const { body,validationResult } =require('express-validator/check');
const {sanitizeBody } = require('express-validator/filter');
const bcrypt = require('bcryptjs');
const passport = require('passport');

//Display User Create form on GET
exports.user_create_get = function(req, res) {
  res.render('register_form');
};

//Handle User Create on POST
exports.user_create_post = [
  //Validate that the fields are not empty
  body('name', 'Name required').isLength({min: 1}).trim(),
  body('email', 'Email required').isLength({min: 1}).trim(),
  body('email', 'Email is not valid').isEmail().trim(),
  body('username', 'Username is required').isLength({min: 1}).trim(),
  //body('password', 'Password must be at least 6 characters').matches('password2').isLength({min: 6}).trim(),
  body('password')
		.isLength({ min: 1 })
		.withMessage('Password is required.'),
  //body('password2', 'Passwords do not match').matches('password').isLength({min: 6}).trim(),
  body('password2')
    .isLength({ min: 1 })
    .withMessage('Confirm password is required.')
    .custom((value,{req, loc, path}) => {
      if (value !== req.body.password) {
          // trow error if passwords do not match
          throw new Error("Passwords don't match");
      } else {
          return value;
      }
    }),

  //Sanitize fields
  sanitizeBody('name').escape(),
  sanitizeBody('email').escape(),
  sanitizeBody('username').escape(),
  sanitizeBody('password').escape(),
  sanitizeBody('password2').escape(),

  //Process request
  (req, res, next) => {

    //Extract errors
    const errors = validationResult(req);

    // create a User object
    let user = new User(
      {
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
      }
    );
    
    if (!errors.isEmpty()) {
      res.render('register_form', { user: req.body, errors: errors.array() });
      return;
    } else {
      bcrypt.genSalt(10, function(err, salt) {
        if(err) {
          return next(err);
        }
        bcrypt.hash(user.password, salt, function(err, hash) {
          if (err) {
            return next(err);
          } else {
            user.password = hash;
            user.save(function (err) {
              if (err) { return next(err); }
              // Successful - redirect to new record.
              req.flash('success', 'You are now registered, and can log in.')
              res.redirect('/users/login');
            })
          }
        })
      })
    }
  }
];

//Display User Login form on GET
exports.user_login_get = function(req, res) {
  res.render('login_form');
};

//Handle User Login on POST
/*exports.user_login_post = function(req, res, next) {
  passport.authenticate('local', { 
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true})(req, res, next);
};*/