const Campground = require('../models/campground.js');
const Review = require('../models/review.js');

module.exports.newReview = async (req, res, next) => {
    const review = await new Review(req.body.review);
    review.author = req.user._id;
    const campground = await Campground.findById(req.params.id);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Review succesfully added!');
    res.redirect(`/campgrounds/${req.params.id}`);
};

module.exports.deleteReview = async (req, res, next) => {
    const { id, revID } = req.params;
    await Review.findByIdAndDelete(revID);
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: revID } });
    req.flash('success', 'Review succesfully deleted!');
    res.redirect(`/campgrounds/${id}`);
};