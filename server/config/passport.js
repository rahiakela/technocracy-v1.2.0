var passport=require("passport");
var LocalStrategy=require("passport-local").Strategy;
var FacebookStrategy=require("passport-facebook").Strategy;
var GoogleStrategy=require("passport-google-oauth").OAuth2Strategy;
var LinkedInStrategy=require("passport-linkedin-oauth2").Strategy;
var TwitterStrategy=require("passport-twitter").Strategy;

var mongoose=require("mongoose");
var User=mongoose.model("User");
var configAuth=require("./auth");

/*passport.serializeUser(function (user,done) {
    done(null,user);
});
passport.deserializeUser(function (id,done) {
    User.findById(id,function (err,user) {
        done(err,user);
    });
});*/

//local authentication strategy
passport.use(new LocalStrategy({
        usernameField:'email'
    },function(username,password,done){
        //Search MongoDB for user with supplied email address
        User.findOne({"local.email":username}, function(err,user){
            if(err)
                return done(err);
            //If no user is found,return false and a message
            if(!user){
                return done(null,false,{
                    message:"Incorrect username."
                });
            }

            //Call validPassword method, passing supplied password
            if(!user.validPassword(password, user)){
                //If password is incorrect, return false and a message
                return done(null,false,{
                    message:"Incorrect password."
                });
            }

            //If we’ve got to the end we can return user object
            return done(null, user);
        });
    }
));

//facebook authentication strategy
passport.use(new FacebookStrategy({
    clientID:configAuth.facebookAuth.clientID,
    clientSecret:configAuth.facebookAuth.clientSecret,
    callbackURL:configAuth.facebookAuth.callbackURL,
    profileFields:['id', 'email', 'first_name', 'last_name']
},function (token, refreshToken, profile, done) {
    //asynchronous verification
    process.nextTick(function () {
        User.findOne({"facebook.id":profile.id},function (err,user) {
            if(err)
                return done(err);
            if(user){
                return done(null,user);
            }else {
                var newUser=new User();
                newUser.facebook.id   =profile.id;
                newUser.facebook.token=profile.token;
                newUser.facebook.name =profile.name.givenName+" "+profile.name.familyName;
                newUser.facebook.email=(profile.emails[0].value || '').toLowerCase();
                newUser.facebook.photos=`https://graph.facebook.com/${profile.id}/picture?type=large`;
                newUser.save(function (err) {
                    if(err)
                        throw err;
                    return done(null,newUser);
                });
            }
        });
    });
}));

//google authentication strategy
passport.use(new GoogleStrategy({
    clientID:configAuth.googleAuth.clientID,
    clientSecret:configAuth.googleAuth.clientSecret,
    callbackURL:configAuth.googleAuth.callbackURL
},function (token, refreshToken, profile, done) {
    //asynchronous verification
    process.nextTick(function () {
        User.findOne({"google.id":profile.id},function (err,user) {
            if(err)
                return done(err);
            if(user){
                return done(null,user);
            }else {
                var newUser=new User();
                newUser.google.id   =profile.id;
                newUser.google.token=profile.token;
                newUser.google.name =profile.displayName;
                newUser.google.email=profile.emails[0].value;
                newUser.google.photos=profile.photos[0].value;

                newUser.save(function (err) {
                    if(err)
                        throw err;
                    return done(null,newUser);
                });
            }
        });
    });
}));

//LinkedIn authentication strategy
passport.use(new LinkedInStrategy({
    clientID:configAuth.linkedInAuth.clientID,
    clientSecret:configAuth.linkedInAuth.clientSecret,
    callbackURL:configAuth.linkedInAuth.callbackURL,
    scope:['r_emailaddress', 'r_basicprofile']
},function (token, tokenSecret, profile, done) {
    //asynchronous verification
    process.nextTick(function () {
        User.findOne({"linkedIn.id":profile.id},function (err,user) {
            if(err)
                return done(err);
            if(user){
                return done(null,user);
            }else {
                var newUser = new User();
                newUser.linkedIn.id          = profile.id;
                newUser.linkedIn.token       = profile.token;
                newUser.linkedIn.username    = profile.username;
                newUser.linkedIn.email       = profile.emails[0].value;
                newUser.linkedIn.displayName = profile.displayName;
                newUser.linkedIn.photos      = profile.photos[0].value;

                newUser.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
            }
        });
    });
}));

//Twitter  authentication strategy
passport.use(new TwitterStrategy({
    consumerKey:configAuth.twitterAuth.consumerKey,
    consumerSecret:configAuth.twitterAuth.consumerSecret,
    callbackURL:configAuth.twitterAuth.callbackURL
},function (token, tokenSecret, profile, done) {
    //asynchronous verification
    process.nextTick(function () {
        User.findOne({"twitter.id":profile.id},function (err,user) {
            if(err)
                return done(err);
            if(user){
                return done(null,user);
            }else {
                var newUser = new User();
                newUser.twitter.id          = profile.id;
                newUser.twitter.token       = profile.token;
                newUser.twitter.username    = profile.username;
                newUser.twitter.displayName = profile.displayName;
                newUser.twitter.photos      = profile.photos[0].value;

                newUser.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
            }
        });
    });
}));


