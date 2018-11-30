var express=require("express");
var router=express.Router();
var passport=require("passport");

//Facebook routes
router.get("/auth/facebook",passport.authenticate("facebook",{scope:"email"}));
router.get("/auth/facebook/callback",passport.authenticate("facebook",{session: false, failureRedirect : '/'}),
    // on success
    function (req,res) {
        req.session.user={
            id:req.user.facebook.id,
            name:req.user.facebook.name,
            email:req.user.facebook.email,
            photos:req.user.facebook.photos
        };
        res.end();
    },
    // on error
    function (err,req,res,next) {
        if(err) {
            res.status(400);
            res.render('error', {message: err.message});
        }
    }
);

//Google routes
router.get("/auth/google",passport.authenticate("google",{scope:['profile', 'email']}));
router.get("/auth/google/callback",passport.authenticate("google",{session: false, failureRedirect : '/'}),
    // on success
    function (req,res) {
        req.session.user={
            id:req.user.google.id,
            name:req.user.google.name,
            email:req.user.google.email,
            photos:req.user.google.photos
        };
        res.end();
    },
    // on error
    function (err,req,res,next) {
        if(err) {
            res.status(400);
            res.render('error', {message: err.message});
        }
    }
);

//LinkedIn routes
router.use("/auth/linkedin",passport.authenticate("linkedin"));
router.use("/auth/linkedin/callback",passport.authenticate("linkedin",{session: false, failureRedirect : '/'}),
    // on success
    function (req,res) {
        req.session.user={
            id:req.user.linkedIn.id,
            name:req.user.linkedIn.displayName,
            email:req.user.linkedIn.email,
            photos:req.user.linkedIn.photos
        };
        res.end();
    },
    // on error
    function (err,req,res,next) {
        if(err) {
            res.status(400);
            res.render('error', {message: err.message});
        }
    }
);

//Twitter routes
router.get("/auth/twitter",passport.authenticate("twitter"));
router.get("/auth/twitter/callback",passport.authenticate("twitter",{session: false, failureRedirect : '/'}),
    // on success
    function (req,res) {
        req.session.user={
            id:req.user.twitter.id,
            name:req.user.twitter.name,
            email:req.user.twitter.email,
            photos:req.user.twitter.photos
        };
        res.end();
    },
    // on error
    function (err,req,res,next) {
        if(err) {
            res.status(400);
            res.render('error', {message: err.message});
        }
    }
);

//export router
module.exports=router;