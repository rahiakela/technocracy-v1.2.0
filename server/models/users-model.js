const mongoose = require("mongoose");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

//user model declaration
let userSchema = new mongoose.Schema({
    subscription: {type: String, required: true, default: "N"},
    role: {type: String, required: true, default: "user"}, // admin, author and user
    local: {
        email: {type: String, unique: true},
        name: String,
        image: String,
        lastLogin: {type: Date, required: true, default: Date.now()},
        createdOn: {type: Date, required: true, default: Date.now()},
        active: {type: String, required: true, default: "N"},
        activatedOn: {type: Date},
        activateToken: {
            token: {type: String},
            expires: {type: Date}
        },
    },
    facebook: {
        uid: {type: String, unique: true},
        token: {type: String},
        email: {type: String, unique: true},
        name: String,
        image: String,
        lastLogin: {type: Date, required: true, default: Date.now()},
        createdOn: {type: Date, required: true, default: Date.now()}
    },
    google: {
        uid: {type: String, unique: true},
        token: {type: String},
        email: {type: String, unique: true},
        name: String,
        image: String,
        lastLogin: {type: Date, required: true, default: Date.now()},
        createdOn: {type: Date, required: true, default: Date.now()}
    },
    twitter: {
        uid: {type: String, unique: true},
        token: {type: String},
        email: {type: String, unique: true},
        name: String,
        image: String,
        lastLogin: {type: Date, required: true, default: Date.now()},
        createdOn: {type: Date, required: true, default: Date.now()}
    },
    linkedin: {
        uid: {type: String, unique: true},
        token: {type: String},
        email: {type: String, unique: true},
        name: String,
        image: String,
        lastLogin: {type: Date, required: true, default: Date.now()},
        createdOn: {type: Date, required: true, default: Date.now()}
    },
    hash: String,
    salt: String,
    jwtToken: String,
    profile: {type:String, ref:"Profile"}
});

userSchema.methods.setPassword = (password) => {
    this.salt = crypto.randomBytes(16).toString("hex"); //Create a random string for salt
    this.hash = crypto.pbkdf2Sync(password, this.salt, 100000, 64, "sha512"); //Create encrypted hash
};

userSchema.methods.validPassword = (password, user) => {
    const newHash = crypto.pbkdf2Sync(password, user.salt, 100000, 512, "sha512").toString('hex');
    return user.hash === newHash;
};

/*
* A JWT is used to pass data around, in our case between the API on
 the server and the SPA in the browser. A JWT can also be used by the server that generated
 the token to authenticate a user, when it’s returned in a subsequent request.
* */
userSchema.methods.generateJWT = (id, email, name) => {
    let expiry = new Date();
    expiry.setDate(expiry.getDate() + 7); // Create expiry date object and set for seven days

    //To generate a JWT, we simply need to call a sign method on the jsonwebtoken
    //library, sending the payload as a JSON object and the secret as a string.
    return jwt.sign({ // Call jwt.sign method and return what it returns
        _id: id, // Pass payload to method
        email: email,
        name: name,
        exp: parseInt(expiry.getTime() / 1000) // Including exp as Unix time in seconds
    }, process.env.JWT_SECRET); // Send secret for hashing algorithm to use
};

mongoose.model("User", userSchema);