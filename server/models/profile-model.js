const mongoose = require("mongoose");

//author model declaration
let profileSchema=mongoose.Schema({
    name: {type: String, required: true},
    designation: String,
    description: String,
    company: String,
    joinedOn: {type: Date, required: true, default: Date.now()},
    phone: Number,
    address: String,
    city: String,
    country: String,
    photo: String,
    skills:[String],
    socialLink: {
        facebook: {type: String},
        twitter: {type: String},
        google: {type: String},
        linkedin: {type: String}
    },
    user:{type:String, ref:"User"}
});

mongoose.model("Profile", profileSchema);