const express = require('express');
const router = express.Router();

const catchAsync = require('../utilities/catchAsync.js');

const { uploadFiles } = require('../cloudinary/index.js');

const { isLoggedIn, isAuthor, validateCampground } = require('../utilities/middleware');

const { renderCampgrounds, createCampground, renderNewForm, showCampground, renderEditForm, updateCampground, deleteCampground } = require('../controllers/campgrounds.js');

router.route('/')
    .get(catchAsync(renderCampgrounds))
    .post(isLoggedIn, uploadFiles, validateCampground, catchAsync(createCampground));

router.get('/new', isLoggedIn, renderNewForm);

router.route('/:id')
    .get(catchAsync(showCampground))
    .put(isLoggedIn, isAuthor, uploadFiles, validateCampground, catchAsync(updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(deleteCampground));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(renderEditForm));

module.exports = router;