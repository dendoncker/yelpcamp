const Campground = require('../models/campground.js');
const ExpressError = require('../utilities/ExpressError.js');
const ObjectID = require('mongoose').Types.ObjectId;

const { cloudinary } = require('../cloudinary/index.js');

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocoder = mbxGeocoding({ accessToken: process.env.MAPBOX_TOKEN });

module.exports.renderCampgrounds = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index.ejs', { campgrounds });
};

module.exports.createCampground = async (req, res, next) => {
    const campground = await new Campground(req.body.campground);
    campground.images = req.files.map((file) => ({ filename: file.filename, url: file.path }));
    campground.author = req.user._id;
    geoData = await geocoder.forwardGeocode({
        query: campground.city + ',' + campground.state,
        limit: 1
    }).send();
    if (!geoData.body.features[0]) {
        throw new ExpressError('City not found', 502);
    };
    campground.geometry = geoData.body.features[0].geometry;
    await campground.save();
    req.flash('success', 'Campground successfully added!');
    res.redirect(`/campgrounds/${campground.id}`);
};

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new.ejs');
};

module.exports.showCampground = async (req, res, next) => {
    if (!ObjectID.isValid(req.params.id)) {
        throw new ExpressError('Camp not found: invalid ID', 502);
    }
    const campground = await Campground.findById(req.params.id)
        .populate({
            path: 'reviews',
            populate: { path: 'author' }
        }).populate('author');
    if (!campground) {
        throw new ExpressError('Camp not found', 502);
    }
    res.render('campgrounds/show.ejs', { campground });
};

module.exports.renderEditForm = async (req, res, next) => {
    if (!ObjectID.isValid(req.params.id)) {
        throw new ExpressError('Camp not found: invalid ID', 502);
    }
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        throw new ExpressError('Camp not found', 502);
    }
    res.render('campgrounds/edit.ejs', { campground });
};

module.exports.updateCampground = async (req, res, next) => {
    const campground = await Campground.findByIdAndUpdate(req.params.id, req.body.campground);

    if (!req.files.length && req.body.deleteImages && req.body.deleteImages.length === campground.images.length) {
        req.flash('error', 'Campground must have at least one image.');
        return res.redirect(`/campgrounds/${campground._id}/edit`);
    }

    if (req.body.deleteImages) {
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
        req.body.deleteImages.forEach(image => {
            cloudinary.uploader.destroy(image);
        });
    }

    const newImages = req.files.map((file) => ({ filename: file.filename, url: file.path }));
    campground.images.push(...newImages);

    campground.save();
    req.flash('success', 'Campground successfully updated!');
    res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCampground = async (req, res, next) => {
    await Campground.findByIdAndDelete(req.params.id);
    req.flash('success', 'Campground successfully deleted!');
    res.redirect('/campgrounds');
};