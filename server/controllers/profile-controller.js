const mongoose=require("mongoose");
let User=mongoose.model("User");
let Profile=mongoose.model("Profile");

let getProfile=(req, res, next) => {

    //getting user id from http request
    let userId=req.param("userId");

    //Validate that required fields have been supplied
    if(!userId){
        next(res.json({"statusCode":400,message:"Fields[user id] must be required"}));
        return;
    }

    Profile.findOne({"user" : userId})
        .exec()
        .then((profile) => {
            if(profile){ //if profile found then return this profile
                next(res.json({"statusCode":200,'profile':profile}));
            } else {
                next(res.json({"statusCode": 404, message: `The profile does not exist for ${userId}`}));
            }
        })
        .catch((err) => next(err));
};

let saveProfile = (req, res, next) => {

    const userId = req.param("userId");
    const name=req.body.name;
    const designation=req.body.designation;
    const description=req.body.description;
    const company=req.body.company;
    const phone=req.body.phone;
    const address=req.body.address;
    const city=req.body.city;
    const country=req.body.country;
    const photo=req.body.photo;
    const skills=req.body.skills;

    //Validate that required fields have been supplied
    if(!userId || !name){
        next(res.json({"statusCode":400,message:"Fields[user id and name] must be required"}));
        return;
    }

    //load user instance from database
    User.findById({"_id":userId})
        .then((user) => {
            //Create a new Profile instance and set its properties
            const newProfile = Profile({
                "name": name,
                "designation": designation,
                "description": description,
                "company": company,
                "phone":phone,
                "address":address,
                "city":city,
                "country":country,
                "photo":photo,
                "skills":skills,
                "profile":user._id
            });

            //Save this Profile to MongoDB
            newProfile.save()
                .then((profile) => next(res.json({"statusCode":200,'profile':profile})))
                .catch((err) => next(err));
        })
        .catch((err) => next(err));
};

let updateProfile = (req, res, next) => {

    const name=req.body.name;
    const designation=req.body.designation;
    const description=req.body.description;
    const company=req.body.company;
    const phone=req.body.phone;
    const address=req.body.address;
    const city=req.body.city;
    const country=req.body.country;
    const photo=req.body.photo;
    const skills=req.body.skills;

    //Validate that required fields have been supplied
    if(!req.param("profileId") || !name){
        next(res.json({"statusCode":400,message:"Fields[profile id and name] must be required"}));
        return;
    }

    Profile.findOne({"_id" : req.param("profileId")})
        .then((profile) => {
            if(profile){ //if user found then question-edit this user
                profile.name= name;
                profile.designation=designation;
                profile.description=description;
                profile.company=company;
                profile.phone=phone;
                profile.address=address;
                profile.city=city;
                profile.country=country;
                profile.photo=photo;
                profile.skills=skills;

                //update this profile to MongoDB
                profile.save()
                    .then(() => next(res.json({"statusCode":200,'profile':profile})))
                    .catch((err) => next(err));
            }
        })
        .catch((err) => next(err));
};

let updateProfileImage = (req, res, next) => {
    const userId = req.param("userId");

    //Validate that required fields have been supplied
    if(!userId || !req.body){
        next(res.json({"statusCode":400,message:"Fields[user id and user] must be required"}));
        return;
    }

    // find and update user with id and populate with profile
    User.findOneAndUpdate(
        {"_id": userId},            // query criteria
        req.body,                   // data to update
        {new: true}                 // options: return updated one
    )
    .populate("profile")            // populate profile instance
    .then((returnUser) => {
        // clear hash and salt value
        returnUser.salt = "";
        returnUser.hash = "";
        next(res.json({"statusCode": 200, "user": returnUser}));
    })
    .catch((err) => next(err));
};

let deleteProfile = (req, res, next) => {

    //Validate that required fields have been supplied
    if(!req.param("profileId")){
        next(res.json({"statusCode":400,message:"Fields[profile id] must be required"}));
        return;
    }

    Profile.findByIdAndRemove(req.param("profileId"))
        .then((profile) => next(res.json({"statusCode":200,message:"Profile deleted"})))
        .catch((err) => next(err));
};

module.exports = {
    getProfile: getProfile,
    saveProfile: saveProfile,
    updateProfile: updateProfile,
    updateProfileImage: updateProfileImage,
    deleteProfile: deleteProfile
};