const passport=require("passport");
//var crypto=require("bcrypt-nodejs");
const mongoose=require("mongoose");
const dateTime = require("../utils/data-time-util");
const crypto=require("crypto");
let HashMap = require("hashmap");
let User=mongoose.model("User");
const mailSender = require("../mail/mail-sender");

let prepareActivateToken = () => {

    // create random 16 character token
    let chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let token = "";
    for (let i = 16; i > 0; --i) {
        token += chars[Math.round(Math.random() * (chars.length - 1))];
    }

    // create expiration date
    let expires = new Date();
    expires.setHours(expires.getHours() + 24); // set 24 hours token expiry time

    return {
        "token": token,
        "expires": expires
    };
};

let register=(req, res, next) => {
    
    const mailId = req.body.local.email;
    const username = req.body.local.username;
    const password = req.body.local.password;
    let mailOptions = new HashMap();

    //Respond with an error status if not all required fields are found
    if(!username || !mailId || !password){
        next(res.json({"statusCode":400,message:"All fields required"}));
        return;
    }

    User.findOne({"local.email":mailId})
        .then((user) => {
            let token;

            if(user != null){
                // token=user.generateJWT; //Generate a JWT using schema method and send it to browser
                next(res.json({"statusCode":200,'user':user}));
                return;
            }

            //Create a new user instance and set name and email
            const salt=crypto.randomBytes(16).toString('hex');  // Create a random string for salt
            const hash=crypto.pbkdf2Sync(password,salt,100000,512,"sha512").toString('hex'); // Create encrypted hash
            const activateToken = prepareActivateToken();
            let newUser=User({
                "local": {
                    "name": username,
                    "email": mailId,
                    "activateToken": activateToken
                },
                "salt": salt,
                "hash": hash
            });

            //Save new user to MongoDB
            newUser.save()
                .then(() => {
                    // send mail id verification mail to user
                    mailSender.sendMail(mailId, mailOptions.set("activateToken", activateToken), "activate-mail");
                    next(res.json({"statusCode":200,"user":newUser}));
                })
                .catch((err) => {
                    console.error(err.stack);
                    next(err);
                });
        })
        .catch((err) => {
            console.error(err.stack);
            next(err);
        });
};

let activateAccount = (req, res, next) => {

    const verifyToken = req.param("verifyToken");

    //Respond with an error status if not all required fields are found
    if(!verifyToken){
        next(res.json({"statusCode":400,message:"VerifyToken is required to activate user account"}));
        return;
    }

    User.findOne({"local.activateToken.token" : verifyToken, "local.active": "N"})
        .then((user) => {
            if(user !== null){ //if user found then check its expiry time
                let token;
                const expires = new Date(user.local.activateToken.expires);
                let expiredHours = dateTime.getExpiredTime(new Date(Date.now()), expires);
                // expiry time must be within 24 hours
                if (expiredHours <= 24) {
                    // update user instance
                    User = user;
                    User.local.active = "Y";
                    User.local.activatedOn = Date.now();
                    //update this user to MongoDB
                    User.save()
                        .then(() => {
                            // if user instance saved then generate and send a JWT token
                            token=user.generateJWT(user);
                            // send welcome mail to user
                            mailSender.sendMail(user.local.email, null, "welcome-mail");
                            next(res.json({"statusCode":200, "token":token, "user": User}));
                        })
                        .catch((err) => {
                            console.error(err.stack);
                            next(err);
                        });
                } else {
                    next(res.json({"statusCode":400,"message": "The account activation code has been expired"}));
                }
            } else {
                next(res.json({"statusCode":200,"message": "The account is already activated"}));
            }
        })
        .catch((err) => {
            console.error(err.stack);
            next(err);
        });
};

let reverifyMailAccount=(req, res, next) => {
    const mailId = req.param("email");
    let mailOptions = new HashMap();

    //Respond with an error status if not all required fields are found
    if(!mailId){
        next(res.json({"statusCode":400,message:"Mail id is required"}));
        return;
    }

    User.findOne({"local.email":mailId})
        .then((user) => {
            const verifyToken = prepareActivateToken();
            User = user;
            User.local.activateToken = verifyToken;

            //Update user to MongoDB
            User.save()
                .then(() => {
                    // send mail id verification mail to user
                    mailSender.sendMail(mailId, mailOptions.set("activateToken", verifyToken), "activate-mail");
                    next(res.json({"statusCode":200, "user": User}));
                })
                .catch((err) => {
                    console.error(err.stack);
                    next(err);
                });
        })
        .catch((err) => {
            console.error(err.stack);
            next(err);
        });
};

let updateMailAccount = (req, res, next) => {

    const newMailId = req.param("newMailId");
    const oldMailId = req.param("oldMailId");
    let mailOptions = new HashMap();

    //Respond with an error status if not all required fields are found
    if(!newMailId && !oldMailId){
        next(res.json({"statusCode":400,message:"Old and new mail ids are required to update user account"}));
        return;
    }

    User.findOne({"local.email" : oldMailId})
        .then((user) => {
            if(user){ //if user found then update old mail id with new one
                const verifyToken = prepareActivateToken();
                User = user;
                User.local.email = newMailId;
                User.local.activateToken = verifyToken;

                //Update user to MongoDB
                User.save()
                    .then(() => {
                        // send mail id verification mail to user
                        mailSender.sendMail(newMailId, mailOptions.set("activateToken", verifyToken), "activate-mail");
                        next(res.json({"statusCode":200, "user": User}));
                    })
                    .catch((err) => {
                        console.error(err.stack);
                        next(err);
                    });
            }
        })
        .catch((err) => {
            console.error(err.stack);
            next(err);
        });
};

let login=(req, res, next) => {
    const email = req.body.local.email;
    const password = req.body.local.password;

    //Validate that required fields have been supplied
    if(!email && !password){
        next(res.json({"statusCode":400,message:"All fields required"}));
        return;
    }

    // recreate request body so that it could be accepted by paasport middleware
    req.body.email = email;
    req.body.password = password;

    //Pass name of strategy and a callback to authenticate method
    let data=passport.authenticate('local',(err, user, info) => {
        let token;

        //Return an error if method Passport returns an error
        if(err){
            next(res.json({"statusCode":404,message:err}));
            return;
        }

        if(user) {

            if(user.local.active === 'Y') { // check user account active or not
                // if Passport returned a user instance, then generate and send a JWT token
                token=user.generateJWT(user._id, user.local.email, user.local.name);

                // return the user after removing salt, hash and assigning jwt token
                // populate profile if the profile exist
                if (user.profile !== undefined) {
                    User.findOne({"_id": user._id.toString()},{"salt": 0, "hash": 0})
                        .populate("profile")
                        .then((returnUser) => {
                            returnUser.jwtToken = token;
                            next(res.json({"statusCode":200, "user":returnUser}));
                        })
                        .catch((err) => next(err));
                } else {
                    user.jwtToken = token;
                    user.salt = "";
                    user.hash = "";
                    next(res.json({"statusCode":200, "user": user}));
                }
            }else if(user.local.active === 'N') { //Otherwise return not active message
                next(res.json({"statusCode":404, "message": "Account is not active,\nplease verify your mail id."}));
            }else {
                next(res.json({"statusCode":401, "message": info.message})); //Otherwise return info message (why authentication failed)
            }
        } else {
            next(res.json({"statusCode":500, "message": info.message}));
        }
    })(req,res); //Make sure that req and res are available to Passport
};

let saveUserInfo=(req, res, next) => {

    let provider,email,name,uid,image,token="";

    if(req.body.facebook){
        provider=req.body.facebook.provider;
        email=req.body.facebook.email;
        name=req.body.facebook.name;
        uid=req.body.facebook.uid;
        image=req.body.facebook.image;
        token=req.body.facebook.token;

        //Validate that required fields have been supplied
        if(!email || !name || !uid){
            next(res.json({"statusCode":400,message:"Fields[email,name and uid] must be required"}));
            return;
        }

        User.findOne({"facebook.uid" : uid})
            .then((user) => {

                if(user){ //if user found then return this user
                    // generate and send a JWT token
                    const token=user.generateJWT(user._id, user.facebook.email, user.facebook.name);
                    user.jwtToken = token;
                    next(res.json({"statusCode":200, 'user':user}));
                    return;
                } else { //if not found then create new facebook user
                    //Create a new facebook user instance and set its properties
                    let newUser=User({
                        "facebook": {
                            "name": name,
                            "email": email,
                            "uid": uid,
                            "image": image,
                            "token":token,
                            "lastLogin": Date.now(),
                            "createdOn": Date.now()
                        }
                    });

                    //Save this facebook user to MongoDB
                    newUser.save()
                        .then(() => {
                            // generate and send a JWT token
                            const token=user.generateJWT(user._id, email, name);
                            // send welcome mail to user
                            mailSender.sendMail(email, null, "welcome-mail");
                            newUser.jwtToken = token;
                            next(res.json({"statusCode": 200, "user": newUser}));
                        })
                        .catch((err) => {
                            console.error(err.stack);
                            next(err);
                        });
                }
            })
            .catch((err) => {
                console.error(err.stack);
                next(err);
            });
    }

    if(req.body.google){
        provider=req.body.google.provider;
        email=req.body.google.email;
        name=req.body.google.name;
        uid=req.body.google.uid;
        image=req.body.google.image;
        token=req.body.google.token;

        //Validate that required fields have been supplied
        if(!email || !name || !uid){
            next(res.json({"statusCode":400,message:"Fields[email,name and uid] must be required"}));
            return;
        }

        User.findOne({"google.uid" : uid})
            .then((user) => {
                if(user){ //if user found then return this user
                    // generate and send a JWT token
                    const token=user.generateJWT(user._id, user.google.email, user.google.name);
                    user.jwtToken = token;
                    next(res.json({"statusCode": 200, 'user': user}));
                    return;
                }else { //if not found then create new google user
                    //Create a new google user instance and set its properties
                    let newUser=User({
                        "google": {
                            "name": name,
                            "email": email,
                            "uid": uid,
                            "image": image,
                            "token":token,
                            "lastLogin": Date.now(),
                            "createdOn": Date.now()
                        }
                    });

                    //Save this google user to MongoDB
                    newUser.save()
                        .then(() => {
                            // generate and send a JWT token
                            const token=user.generateJWT(user._id, email, name);
                            // send welcome mail to user
                            mailSender.sendMail(email, null, "welcome-mail");
                            newUser.jwtToken = token;
                            next(res.json({"statusCode": 200, "user": newUser}));
                        })
                        .catch((err) => {
                            console.error(err.stack);
                            next(err);
                        });
                }
            })
            .catch((err) => {
                console.error(err.stack);
                next(err);
            });
    }

    if(req.body.linkedin){
        provider=req.body.linkedin.provider;
        email=req.body.linkedin.email;
        name=req.body.linkedin.name;
        uid=req.body.linkedin.uid;
        image=req.body.linkedin.image;
        token=req.body.linkedin.token;

        //Validate that required fields have been supplied
        if(!email || !name || !uid){
            next(res.json({"statusCode":400,message:"Fields[email,name and uid] must be required"}));
            return;
        }

        User.findOne({"linkedin.uid" : uid})
            .then((user) => {
                if(user){ //if user found then return this user
                    // generate and send a JWT token
                    const token=user.generateJWT(user._id, user.linkedin.email, user.linkedin.name);
                    user.jwtToken = token;
                    next(res.json({"statusCode": 200, "user": user}));
                    return;
                }else { //if not found then create new linkedin user
                    //Create a new linkedin user instance and set its properties
                    let newUser=User({
                        "linkedin": {
                            "name": name,
                            "email": email,
                            "uid": uid,
                            "image": image,
                            "token":token,
                            "lastLogin": Date.now(),
                            "createdOn": Date.now()
                        }
                    });

                    //Save this linkedin user to MongoDB
                    newUser.save()
                        .then(() => {
                            // generate and send a JWT token
                            const token=user.generateJWT(user._id, email, name);
                            // send welcome mail to user
                            mailSender.sendMail(email, null, "welcome-mail");
                            newUser.jwtToken = token;
                            next(res.json({"statusCode": 200, "user": newUser}));
                        })
                        .catch((err) => {
                            console.error(err.stack);
                            next(err);
                        });
                }
            })
            .catch((err) => {
                console.error(err.stack);
                next(err);
            });
    }
};

module.exports = {
    register: register,
    activateAccount: activateAccount,
    reverifyMailAccount: reverifyMailAccount,
    updateMailAccount: updateMailAccount,
    login: login,
    saveUserInfo: saveUserInfo
};