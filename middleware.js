const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const expressError = require("./utils/expressErr.js");
const {listingSchema, reviewSchema} = require("./schema.js");

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        //redirect url
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to create new listing");
        return res.redirect("/login");
    }
    next();
}

//flow- user creates a new listing =>> has to be logged in => if not logged in goes to login page => after login should go to the landing page(og url)
//but while using passport after middleware is called(auth is done), passport resets req.session
//therefore we save req.session in req.locals


module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next(); 
};
    

module.exports.isOwner= async(req,res,next)=>{
    let {id}=  req.params;
    let listing = await Listing.findById(id);       //for authorization: first fin by id and match with curr user...then move forward with updation 
    if(!listing.owner._id.equals(res.locals.currentUser._id)){
        req.flash("error", "You are not the owner of this listing!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isReviewAuthor= async(req,res,next)=>{
    let {id, reviewId}=  req.params;
    let review = await Review.findById(reviewId);       //for authorization: first fin by id and match with curr user...then move forward with updation 
    if(!review.author.equals(res.locals.currentUser._id)){
        req.flash("error", "You are not the author of this review!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing = (req,res, next)=>{                //server side validation
    let {error} = listingSchema.validate(req.body);
        if(error){
            let errMsg = err.details.map((el)=>el.message).join(",");
            throw new expressError(400, error)
        }else{
            next();
        }
}

module.exports.validateReview = (req,res,next)=>{                //server side validation
    let {error} = reviewSchema.validate(req.body);
        if(error){
            let errMsg = error.details.map((el)=>el.message).join(",");
            throw new expressError(400, error)
        }else{
            next();
        }
}