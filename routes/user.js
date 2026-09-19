const express = require("express");                       
const router = express.Router(); 
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controllers/users.js");

router.route("/signup")
.get( userController.renderSignupform)
.post( wrapAsync(userController.signup));

router.route("/login")
.get( userController.renderLoginform)
.post(saveRedirectUrl, passport.authenticate("local",
    {
    failureRedirect:"/login",
    failureFlash: true,
    }),
    userController.login)
    
router.get("/logout", userController.logout);

module.exports = router;

//req.originalurl saves the create new listing location(url) => therefore after login it redirects to create new listing page
//but when user is already logged in ...the isloggedin function is not triggered therfore 