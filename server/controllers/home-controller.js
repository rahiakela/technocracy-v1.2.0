const mongoose = require("mongoose");
let User = mongoose.model("User");
const mailSender = require("../mail/mail-sender");

let home = (req, res, next) => {
    next(res.json({"statusCode": 200, "message": "REST API is working fine..."}));
};

let subscribe = (req, res, next) => {

    let mailId = req.param("mailId");
    let found = false;

    //Respond with an error status if not all required fields are found
    if (!mailId) {
        next(res.json({"statusCode": 400, message: "Mail is required for subscription."}));
        return;
    }

    // search user in database against mail id
    User.find({"local.email": mailId})
        .then((user) => {
            if (user.length > 0) {
                found = true;
                updateUserSubscription(res, mailId, user, "Y");
            }
        })
        .catch((err) => {
            console.error(err.stack);
            next(err);
        });

    if (!found) {
        User.find({"facebook.email": mailId})
            .then((user) => {
                if (user.length > 0) {
                    found = true;
                    updateUserSubscription(res, mailId, user, "Y");
                }
            })
            .catch((err) => {
                console.error(err.stack);
                next(err);
            });
    }

    if (!found) {
        User.find({"google.email": mailId})
            .then((user) => {
                if (user.length > 0) {
                    found = true;
                    updateUserSubscription(res, mailId, user, "Y");
                }
            })
            .catch((err) => {
                console.error(err.stack);
                next(err);
            });
    }

    if (!found) {
        User.find({"twitter.email": mailId})
            .then((user) => {
                if (user.length > 0) {
                    found = true;
                    updateUserSubscription(res, mailId, user, "Y");
                }
            })
            .catch((err) => {
                console.error(err.stack);
                next(err);
            });
    }

    if (!found) {
        User.find({"linkedin.email": mailId})
            .then((user) => {
                if (user.length > 0) {
                    found = true;
                    updateUserSubscription(res, mailId, user, "Y");
                }
            })
            .catch((err) => {
                console.error(err.stack);
                next(err);
            });
    }

};

let unsubscribe = (req, res, next) => {

    let mailId = req.param("mailId");
    let found = false;

    //Respond with an error status if not all required fields are found
    if (!mailId) {
        next(res.json({"statusCode": 400, message: "Mail is required for un-subscription."}));
        return;
    }

    // search user in database against mail id
    User.find({"local.email": mailId})
        .then((user) => {
            if (user.length > 0) {
                found = true;
                updateUserSubscription(res, mailId, user, "Y");
            }
        })
        .catch((err) => {
            console.error(err.stack);
            next(err);
        })

    if (!found) {
        User.find({"facebook.email": mailId})
            .then((user) => {
                if (user.length > 0) {
                    found = true;
                    updateUserSubscription(res, mailId, user, "Y");
                }
            })
            .catch((err) => {
                console.error(err.stack);
                next(err);
            })
    }

    if (!found) {
        User.find({"google.email": mailId})
            .then((user) => {
                if (user.length > 0) {
                    found = true;
                    updateUserSubscription(res, mailId, user, "Y");
                }
            })
            .catch((err) => {
                console.error(err.stack);
                next(err);
            })
    }

    if (!found) {
        User.find({"twitter.email": mailId})
            .then((user) => {
                if (user.length > 0) {
                    found = true;
                    updateUserSubscription(res, mailId, user, "Y");
                }
            })
            .catch((err) => {
                console.error(err.stack);
                next(err);
            })
    }

    if (!found) {
        User.find({"linkedin.email": mailId})
            .then((user) => {
                if (user.length > 0) {
                    found = true;
                    updateUserSubscription(res, mailId, user, "Y");
                }
            })
            .catch((err) => {
                console.error(err.stack);
                next(err);
            })
    }
};

let updateUserSubscription = (res, mailId, user, updateValue) => {

    //update this user subscription
    User = user[0];
    User.subscription = updateValue;

    //Update UserModel to MongoDB
    User.save()
        .then(() => {
            // send welcome subscription mail to user otherwise not
            if (updateValue == "Y") {
                mailSender.sendMail(mailId, null, "subscribed");
            }
            next(res.json({"statusCode": 200, "user": User}));
        })
        .catch((err) => {
            console.error(err.stack);
            next(err);
        })
};

module.exports = {
    home: home,
    subscribe: subscribe,
    unsubscribe: unsubscribe,
};