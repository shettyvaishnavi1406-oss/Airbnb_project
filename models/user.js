const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const PassportLocalMongoose = require("passport-local-mongoose").default;

const userSchema = new Schema({
    email:{
        type : String,
        required: true,
    },
    //USERNAME AND PASSWORD(WITH HASHING AND SALTING) IS AUTOMATICALLY CREATED IN PASSPORT PACKAGE
});

// console.log(PassportLocalMongoose);
userSchema.plugin(PassportLocalMongoose); //to implement username, salting, hashing and hashed password to our schema

module.exports = mongoose.model("User", userSchema)