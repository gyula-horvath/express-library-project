const User = require('../models/user');

exports.ensureAuthenticated = function (req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    req.flash('danger', 'Please login');
    res.redirect('/users/login');
  }
}

exports.isAdmin = function (req, res, next) {
  User.findOne({"_id" : req.user._id}, function(err, user){
    if (err) return next(err)
    if (user.role === 'ADMIN') {
      return next();
    } else {
      req.flash('danger', 'Not authorized');
      res.redirect('/');
    }
  })
}