const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync');
const passport = require('passport');
const { storeReturnTo } = require('../utilities/middleware');

const { renderRegisterForm, register, renderLoginForm, login, logout } = require('../controllers/users');

router.route('/register')
    .get(renderRegisterForm)
    .post(catchAsync(register));

router.route('/login')
    .get(renderLoginForm)
    .post(storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), login);

router.get('/logout', logout);

module.exports = router;