const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async(req,res)=>{
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
};

module.exports.renderNewForm = (req,res)=>{
    res.render("./listings/newForm.ejs");
};

module.exports.showListings = async(req,res)=>{
    let {id}=  req.params;
    const listing = await Listing.findById(id)
    .populate({
        path:"reviews",     //listing with reviews...and reviews with author
        populate:{
            path:"author",
        },
    })
    .populate("owner"); //to show all data included in review and not just id
    if(!listing){
        req.flash("error", "Listing does not exist");
        return res.redirect("/listings");
    }
    res.render("./listings/show.ejs", {listing});
};

module.exports.createListing = async(req,res, next)=>{

    let response = await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 1,
    })
    .send();

    // let {title, description, image, price, location, country}=req.body  ;
    let  url = req.file.path;
    let filename  = req.file.filename;
    const newListing= new Listing(req.body.listing);
    newListing.owner =req.user._id; //id of current user
    newListing.image = {url, filename};

    newListing.geometry = response.body.features[0].geometry;
    
    let savedListing = await newListing.save();
    console.log(savedListing);
    req.flash("success", "New Listing Created!");
    //flash msg can be sent as an argument...to make it optimised we create res.locals....for more more optimization we create middleware in app.js
    res.redirect("/listings");

};

module.exports.renderEditForm = async(req,res)=>{
    let {id}=  req.params;
    const listing = await Listing.findById(id); 
    if(!listing){
        req.flash("error", "Listing does not exist");
        return res.redirect("/listings");
    }
    console.log(listing.image);
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_150/");
    res.render("./listings/edit.ejs", {listing, originalImageUrl});
}

module.exports.updateListing = async(req,res)=>{
    let {id}=  req.params;
    let listing = await Listing.findByIdAndUpdate(id, req.body.listing); 

    if(typeof req.file!=="undefined"){
        let  url = req.file.path;
        let filename  = req.file.filename;
        listing.image = {url, filename};
        console.log(listing);
        await listing.save();
    }
    

    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
    
};

module.exports.destroyListing = async(req,res)=>{
    let {id}=  req.params;
    const listing = await Listing.findByIdAndDelete(id); 
    req.flash("success", "Listing Deleted");
    res.redirect(`/listings`);
};