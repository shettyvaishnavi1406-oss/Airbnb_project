const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const mongo_url = "mongodb://127.0.0.1:27017/test"

main()
.then(()=>{
    console.log("connected");
})
.catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(mongo_url)
};

const initDB = async() =>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj, owner:'6aa68f3b1806e08f107fa5af'}));  //...obj means prev data will be same but owner obj will be added to the schema
    await Listing.insertMany(initData.data);
    console.log("data initialised");
};

initDB();