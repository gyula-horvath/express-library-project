var express = require('express');
var router = express.Router();
const limiter = require('../config/authenticator');

var user_controller = require('../controllers/userController');

// GET request for creating a User.
router.get('/register', user_controller.user_create_get);

//POST request for creating a User.
router.post('/register', user_controller.user_create_post);

//GET request for user login.
router.get('/login', user_controller.user_login_get);

//POST request for user login.
router.post('/login', user_controller.user_login_post);

// Logout
router.get('/logout', user_controller.user_logout);

// Load admin page
router.get('/admin', limiter.isAdmin, user_controller.admin_page_get);



module.exports = router;
