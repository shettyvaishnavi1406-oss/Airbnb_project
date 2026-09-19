const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const expressError = require("./utils/expressErr.js");
const {listingSchema, reviewSchema} = require("./schema.js")
const Review = require("./models/review.js")
const session = require("express-session");
const {MongoStore} = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const usersRouter = require("./routes/user.js");

app.set("view engine", "ejs");
app.set(("views", path.join(__dirname, "views")));
app.use(express.urlencoded ({extended: true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.engine("ejs",ejsMate);

// const mongo_url = "mongodb://127.0.0.1:27017/test"
const dbUrl = process.env.ATLAS_DB_URL;

main()
.then(()=>{
    console.log("connected");
})
.catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(dbUrl)
};

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret:process.env.SECRET,
    },
    touchAfter: 24*3600,
})
store.on("error", (err)=>{
    console.log("Error in mongo session store", err);
});

const sessionOptions={
    store,
    secret: "mysupersecret",
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,      //now + no. of milisecond in a week
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
}
app.get("/",(req,res)=>{
    res.redirect("/listings");
});



app.use(session(sessionOptions));
app.use(flash());

//auth(passport) will happen after sessions...as when user logs into thee webpage we dont need auth at every page of the website...
// therefore authenticated user should be common in all sessions

app.use(passport.initialize());
app.use(passport.session()) //lets user identify user as they browse form page to page

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res ,next)=>{         //middleware
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser=req.user;
    next(); //imp
});

// app.get("/demoUser", async (req,res)=>{
//     let fakeUser = new User({
//         email: "student@abc.com",
//         username: "Demo-User"
//     })

//     let registeredUser = await User.register(fakeUser,"helloWorld");   //helloWorld=Password
//     console.log(registeredUser);
// })


app.use("/listings", listingsRouter);  //made shorter with router
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", usersRouter);

app.all("/*splat",(req,res,next)=>{
    next(new expressError(404, "page not found"));

});

app.use((err,req,res,next)=>{
    let {statusCode=500, message="page not found"} = err;
    res.status(statusCode).render("./listings/error.ejs", {err})
    // res.status(statusCode).send(message);
});

app.listen(8080, ()=>{
    console.log("listening");
});


// app.get("/test",async (req,res)=>{
//     let sampleList = new Listing({
//         title: "MyHome",
//         description: "By the beach",
//         price: 1200,
//         location: "Goa",
//         country:"India"

//     })
//     await sampleList.save();
//     res.send("successful");
//     console.log(sampleList);
// })