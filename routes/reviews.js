const express = require('express');
const router = express.Router({ mergeParams: true });

const catchAsync = require('../utilities/catchAsync.js');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../utilities/middleware.js');

const { newReview, deleteReview } = require('../controllers/reviews.js');

router.post('/', isLoggedIn, validateReview, catchAsync(newReview));

router.delete('/:revID', isLoggedIn, isReviewAuthor, catchAsync(deleteReview));

module.exports = router;