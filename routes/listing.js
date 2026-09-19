if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}
//two phases: 1.devolopment and 2.production
//.env should not be uploaded to git...when deploying node_env becomes production



const express = require("express");                         //.. means parent directory
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer')           //for uploading image
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage})


router.route("/")
.get(wrapAsync(listingController.index))   //index
.post( isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync(listingController.createListing));    //Create


//new route
router.get("/new",isLoggedIn, listingController.renderNewForm);

router.route("/:id")
.get( wrapAsync(listingController.showListings))   //Show route
.put(isLoggedIn, isOwner, upload.single('listing[image]'), validateListing,  wrapAsync(listingController.updateListing)) //update route
.delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));   //Delete route   


//edit route
router.get("/:id/edit",isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

module.exports = router;