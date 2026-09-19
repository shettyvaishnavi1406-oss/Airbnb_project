const express = require("express");                       
const router = express.Router({ mergeParams: true });       //mergeParams: true allows a child router to access route parameters(like id) defined in its parent router.
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js")
const Listing = require("../models/listing.js");
const {isLoggedIn,validateReview, isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");


//reviews
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

//delete review
router.delete("/:reviewId",isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview))

module.exports = router;
