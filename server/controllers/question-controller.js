const mongoose=require("mongoose");
let HashMap = require("hashmap");
let Question=mongoose.model("Question");
let User=mongoose.model("User");
let Comment=mongoose.model("Comment");
let Reply=mongoose.model("Reply");
const mailSender = require("../mail/mail-sender");
const questionController = require("./question-controller");

let getQuestions = (req, res, next) => {

    const perPage=20;
    let page=req.param("page") > 0 ? req.param("page"):0;

    //query only published question in publishedOn descending order with pagination
    const questionQuery=Question.find({});
    questionQuery.where("status").eq("published");
    questionQuery.limit(perPage);
    questionQuery.skip(perPage*page);
    questionQuery.sort("publishedOn");
    questionQuery.populate("askedBy");    // populate user instance
    questionQuery.populate({           // populate User instance who commented
        path:"comments",
        populate:{
            path:"commentedBy",
            component:"User"
        }
    });
    questionQuery.populate({          // populate Replys instance
        path:"comments",
        populate:{
            path:"replies",
            component:"Reply",
            populate:{               // populate user who has reply
                path:"repliedBy",
                component:"User"
            }
        }
    });

    questionQuery.exec()
        .then((questions) => next(res.json({"statusCode":200,'questions':questions})))
        .catch((err) => {
            console.error(err.stack);
            next(err);
        });
};

let getQuestion =(req, res, next) => {

    let userId = req.param("userId");

    //Validate that required fields have been supplied
    if(!req.param("_id")){
        next(res.json({"statusCode":400,message:"Fields[question id] must be required"}));
        return;
    }

    //query only published question
    const questionQuery=Question.find({"_id":req.param("_id")});
    questionQuery.where("status").eq("published");
    questionQuery.populate("askedBy");   // load user instance
    questionQuery.populate({          // populate User instance who commented
        path:"comments",
        populate:{
            path:"commentedBy",
            component:"User"
        }
    });
    questionQuery.populate({          // populate Replys instance
        path:"comments",
        populate:{
            path:"replies",
            component:"Reply",
            populate:{                  // populate user who has reply
                path:"repliedBy",
                component:"User"
            }
        }
    });

    questionQuery.exec()
        .then((question) => {
            if (question[0]) {
                next(res.json({"statusCode": 200, 'question': question}));
            } else {
                next(res.json({"statusCode": 404, message: `The question does not exist for ${req.param("_id")}`}));
            }
        })
        .catch((err) => next(err));
};

let getAllQuestions = (req, res, next) => {

    let askedBy=req.param("askedBy");

    //query all questions based on user who asked and exclude inactive question
    const questionQuery=Question.find({"askedBy": askedBy});
    questionQuery.populate("askedBy"); // populate user instance

    questionQuery.exec()
        .then((questions) => {
            next(res.json({"statusCode": 200, 'questions':questions}));
        })
        .catch((err) => {
            console.error(err.stack);
            next(err);
        });
};

let getPendingQuestionList = (req, res, next) => {

    //query all pending question for review and approval
    const questionQuery=Question.find({"status": "pending"});
    questionQuery.populate("askedBy");    // populate user instance

    questionQuery.exec()
        .then((questions) => {
            next(res.json({"statusCode":200,'questions':questions}));
        })
        .catch((err) => {
            console.error(err.stack);
            next(err);
        });
};

let saveQuestion =(req, res, next) => {

    const userId = req.param('userId');
    const actionType = req.param('actionType');
    const title = req.body.title;
    const content = req.body.content;
    const tags = req.body.tags;

    let newQuestion = {};
    let mailOptions = new HashMap();

    //Validate that required fields have been supplied
    if(!userId || !title || !content){
        next(res.json({"statusCode":400,message:"Fields[userid, title and content] must be required"}));
        return;
    }

    // prepare status and date type accordingly to action type
    if (actionType === 'save') {
        newQuestion=Question({
            "title": title,
            "content": content,
            "status": "pending",
            "submittedOn": Date.now(),
            "tags": tags,
            "askedBy": userId
        });
    } else {
        newQuestion=Question({
            "title": title,
            "content": content,
            "status": "draft",
            "createdOn": Date.now(),
            "tags": tags,
            "askedBy": userId
        });
    }

    //Save this question to MongoDB
    newQuestion.save()
        .then(question => {
            // populate user instance
            Question.findOne(question._id)
                .populate("askedBy")
                .exec()
                .then(question => {
                    // don't send mail if the question is saved just as draft
                    if (actionType === 'save') {
                        // send new question post mail notification to editors
                        mailSender.sendMail(process.env.ADMIN_MAIL_ID, mailOptions.set("question", question), "save-question");
                    }
                    next(res.json({"statusCode": 200, "question": question}));
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

    /*//load user instance from database
    User.findOne({"_id": userId})
        .then((user) => {
            mailOptions.set("user", user);
            //Save this question to MongoDB
            newQuestion.save()
                .then((question) => {
                    // don't send mail if the question is saved just as draft
                    if (actionType === 'save') {
                        // send new question post mail notification to editors
                        mailSender.sendMail(process.env.ADMIN_MAIL_ID, mailOptions.set("question", question), "save-question");
                    }
                    next(res.json({"statusCode": 200, "question": question}));
                })
                .catch((err) => {
                    console.error(err.stack);
                    next(err);
                })
        })
        .catch((err) => {
            console.error(err.stack);
            next(err);
        })*/
};

let modifyQuestion =(req, res, next) => {

    const questionId=req.param("questionId");
    const actionType = req.param('actionType');

    let mailOptions = new HashMap();
    let updateQuestion = {};

    if(!questionId) {
        next(res.json({"statusCode": 400, message: "Fields[question id] must be required"}));
        return;
    }

    // prepare status and date type accordingly to action type
    switch (actionType) {
        case 'pending':
            updateQuestion = {"status": "pending", "updatedOn": Date.now()};
            break;
        case 'on_hold':
            updateQuestion = {"status": "on_hold", "holdOnDate": Date.now()};
            break;
        case 'rejected':
            updateQuestion = {"status": "rejected", "rejectedOn": Date.now()};
            break;
        case 'published':
            updateQuestion = {"status": "published", "publishedOn": Date.now()};
            break;
    }

    // find and update question with id and populate with user who asked it
    Question.findOneAndUpdate(
            {"_id": questionId},       // query criteria
            updateQuestion,            // data to update
            {new: true, upsert: true}  // options: return updated one
        )
        .populate("askedBy")
        .then((question) => {
            // send question mail notification to user/subscriber according to action type
            switch (actionType) {
                case 'published':
                    const userQuery = User.find({});
                    userQuery.where("subscription").eq("Y"); // filter the user who has subscribed to mail notification
                    userQuery.exec()
                        .then((users) => {
                            users.forEach(user => {
                                // don't send this notification to the user who has asked the question
                                if(user._id.toString() !== question.askedBy._id.toString()) {
                                    mailSender.sendMail(user, mailOptions.set("question", question), "publish-question");
                                }
                            });
                        })
                        .catch((err) => {
                            console.error(err.stack);
                            next(err);
                        });
                    break;
                case 'pending':
                    // send new question post mail notification to editors
                    mailSender.sendMail(process.env.ADMIN_MAIL_ID, mailOptions.set("question", question), "save-question");
                    break;
                case 'on_hold':
                    mailSender.sendMail(question.askedBy, mailOptions.set("question", question), "on-hold-question");
                    break;
                case 'rejected':
                    mailSender.sendMail(question.askedBy, mailOptions.set("question", question), "rejected-question");
                    break;
            }
            next(res.json({"statusCode":200,"question":question}));
        })
        .catch((err) => {
            console.error(err.stack);
            next(err);
        });
};

let editQuestion =(req, res, next) => {

    const questionId=req.param("questionId");
    const title = req.body.title;
    const content = req.body.content;
    const tags = req.body.tags;

    if(!questionId) {
        next(res.json({"statusCode":400,message:"Fields[question id and user id] must be required"}));
        return;
    }

    Question.findOneAndUpdate(
            {"_id": questionId},   // query criteria
            {"title": title, "content": content, "tags": tags, status: "pending", "updatedOn": Date.now()}, // data to update
            { new: true, upsert: true }      // options: return updated one
        )
        .populate("askedBy")
        .exec()
        .then(question => {
            next(res.json({"statusCode": 200, "question": question}));
        })
        .catch((err) => next(err));
};

let deleteQuestion = (req, res, next) => {

    //Validate that required fields have been supplied
    if(!req.param("questionId")){
        next(res.json({"statusCode":400,message:"Fields[question id] must be required"}));
        return;
    }

    Question.findOneAndUpdate(
            {"_id": req.param("questionId")}, // query criteria
            {"status": "inactive", "inactiveDate": Date.now()}, // update data
            { new: true }                     // options: return updated one
        )
        .then((question) => {
            if (question) {
                next(res.json({"statusCode": 200, "question": question}));
            }
        })
        .catch((err) => next(err));
};

let getTotalQuestion = (req, res, next) => {
    let userId=req.param("userId");

    //get count of all question based on profile id
    Question.count({"askedBy": userId})
        .exec()
        .then((questionCount) => {
            // send question statistics as response
            next(res.json({totalQuestion: questionCount}));
        })
        .catch((err) => {
            next(err);
        });
};

let getTotalPendingQuestion = (req, res, next) => {

    //get count of all pending question
    Question.count({"status": "pending"})
        .exec()
        .then((questionPendingCount) => {
            // send question statistics as response
            next(res.json({totalPendingQuestion: questionPendingCount}));
        })
        .catch((err) => {
            next(err);
        });
};

let saveLike=(req, res, next) => {

    const likedByUser=req.param("userId");
    const questionId=req.param("_id");

    //Validate that required fields have been supplied
    if(!questionId && !likedByUser){
        next(res.json({"statusCode": 400, message: "Fields[question id and user id] must be required"}));
        return;
    }

    //check if the user liked this question earlier or not
    Question.find({"_id": questionId})
        .then((question) => {
            const savedLikedByUser= question[0].likes.filter(like => like === likedByUser);
            //if user does not like this question then update database otherwise not
            if (savedLikedByUser.length === 0){
                Question.update({"_id":questionId},{$push:{likes:{$each:[likedByUser]}}},{})
                    .then(() => questionController.getQuestion(req, res, next))
                    .catch((err) => {
                        console.error(err.stack);
                        next(err);
                    });
            }else{
                // load updated question
                questionController.getQuestion(req, res, next);
            }
        })
        .catch((err) => {
            console.error(err.stack);
            next(err);
        });
};

let voteUp=(req, res, next) => {

    const votedUpByUser=req.param("userId");
    const questionId=req.param("_id");

    //Validate that required fields have been supplied
    if(!questionId && !votedUpByUser){
        next(res.json({"statusCode": 400, message: "Fields[question id and user id] must be required"}));
        return;
    }

    //check if the user vote up this question earlier or not
    Question.find({"_id": questionId})
        .then((question) => {
            const savedVotedUpByUser= question[0].voteUp.filter(votedUpBy => votedUpBy === votedUpByUser);
            //if user does not vote up this question then update database otherwise not
            if (savedVotedUpByUser.length === 0){
                Question.update({"_id":questionId},{$push:{voteUp:{$each:[votedUpByUser]}}},{})
                    .then(() => questionController.getQuestion(req, res, next))
                    .catch((err) => {
                        console.error(err.stack);
                        next(err);
                    });
            }else{
                // load updated question
                questionController.getQuestion(req, res, next);
            }
        })
        .catch((err) => {
            console.error(err.stack);
            next(err);
        });
};

let voteDown=(req, res, next) => {

    const voteDownByUser=req.param("userId");
    const questionId=req.param("_id");

    //Validate that required fields have been supplied
    if(!questionId && !voteDownByUser){
        next(res.json({"statusCode":400,message:"Fields[question id and user id] must be required"}));
        return;
    }

    //check if the user voted down this question earlier or not
    Question.find({"_id": questionId})
        .then((question) => {
            const savedVoteDownByUser= question[0].voteDown.filter(voteDownBy => voteDownBy === voteDownByUser);
            //if user does not vote down this question then update database otherwise not
            if (savedVoteDownByUser.length === 0){
                Question.update({"_id":questionId},{$push:{voteDown:{$each:[voteDownByUser]}}},{})
                    .then(() => questionController.getQuestion(req, res, next))
                    .catch((err) => {
                        console.error(err.stack);
                        next(err);
                    });
            }else{
                // load updated question
                questionController.getQuestion(req, res, next);
            }
        })
        .catch((err) => {
            console.error(err.stack);
            next(err);
        });
};

module.exports = {
    saveQuestion: saveQuestion,
    modifyQuestion: modifyQuestion,
    editQuestion: editQuestion,
    deleteQuestion: deleteQuestion,
    getQuestions: getQuestions,
    getAllQuestions: getAllQuestions,
    getPendingQuestionList: getPendingQuestionList,
    getQuestion: getQuestion,
    getTotalQuestion: getTotalQuestion,
    getTotalPendingQuestion: getTotalPendingQuestion,
    saveLike: saveLike,
    voteUp: voteUp,
    voteDown: voteDown
};