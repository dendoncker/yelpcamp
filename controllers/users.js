const User = require('../models/user');

module.exports.renderRegisterForm = (req, res) => {
    res.render('users/register');
};

module.exports.register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const user = await User.register({ username, email }, password);
        req.login(user, err => {
            if (err) { return next(err); }
            req.flash('success', `Welcome to Yelp Camp ${user.username}!`);
            return res.redirect('/campgrounds');
        });
    } catch (err) {
        req.flash('error', err.message);
        return res.redirect('/register');
    }
};

module.exports.renderLoginForm = (req, res) => {
    res.render('users/login');
};

module.exports.login = (req, res) => {
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    req.flash('success', `Welcome back ${req.user.username}`);
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
};