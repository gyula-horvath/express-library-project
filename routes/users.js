var express = require('express');
var router = express.Router();

var user_controller = require('../controllers/userController');

// GET request for creating a User.
router.get('/register', user_controller.user_create_get);

//POST request for creating a User.
router.post('/register', user_controller.user_create_post);

//GET request for user login.
router.get('/login', user_controller.user_login_get);

//POST request for user login.
router.post('/login', function(req, res, next) {
  passport.authenticate('local', { 
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true})(req, res, next);
});

// logout
router.get('/logout', function(req, res){
  req.logout();
  req.flash('success', 'You are logged out');
  res.redirect('/users/login');
});

module.exports = router;
