const Campground = require('../models/campground');
const Review = require('../models/review');

const joiCampgroundSchema = require('../utilities/joiSchemas/campground.js');
const joiReviewSchema = require('../utilities/joiSchemas/review.js');

const ExpressError = require('./ExpressError.js');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be logged in!');
        return res.redirect('/login');
    }
    next();
};

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
};

module.exports.isAuthor = async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    if (!req.user._id.equals(campground.author)) {
        req.flash('error', "You don't have the permission for this.");
        return res.redirect(`/campgrounds/${req.params.id}`);
    }
    next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
    const review = await Review.findById(req.params.revID);
    if (!req.user._id.equals(review.author)) {
        req.flash('error', "You don't have the permission for this.");
        return res.redirect(`/campgrounds/${req.params.id}`);
    }
    next();
};

module.exports.validateCampground = (req, res, next) => {
    const { error } = joiCampgroundSchema.validate(req.body, { abortEarly: false });
    if (error) {
        const msg = error.details.map(el => el.message).join(' /// ');
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
};

module.exports.validateReview = (req, res, next) => {
    const { error } = joiReviewSchema.validate(req.body, { abortEarly: false });
    if (error) {
        const msg = error.details.map(el => el.message).join(' /// ');
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
};