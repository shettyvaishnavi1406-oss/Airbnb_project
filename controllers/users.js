const User = require("../models/user.js");

module.exports.renderSignupform = (req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.signup = async(req,res,next)=>{
    try{
        let {username, email, password}= req.body;
        const newUser = new User({
            email,
            username 
        });
        const regUser = await User.register(newUser,password); 
        console.log(regUser);
        req.login(regUser, (err)=>{
            if(err){
                return next(err);
            }

            req.flash("success", "Welcome to WanderLust");
            res.redirect("/listings");
        })
        
    }catch(e){
       req.flash("error", e.message); 
       res.redirect("/signup");
    }
    
};

module.exports.renderLoginform = (req,res)=>{
    res.render("users/login.ejs");
};

module.exports.login = async(req,res)=>{     //route middlewear to authenticate reqs
    req.flash("success", "Welcome to WanderLust! You are logged in!");
    let RedirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(RedirectUrl);
};

//req.originalurl saves the create new listing location(url) => therefore after login it redirects to create new listing page
//but when user is already logged in ...the isloggedin function is not triggered therfore 

module.exports.logout = (req,res, next)=>{
    req.logout((err)=>{
        if(err){
           return next(err);
        }
        req.flash("success","You have been logged out");
        res.redirect("/listings");
    })
};