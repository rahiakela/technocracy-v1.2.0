const mongoose=require("mongoose");
let HashMap = require("hashmap");
let Blog=mongoose.model("Blog");
let Question=mongoose.model("Question");
let Profile=mongoose.model("Profile");
let User=mongoose.model("User");
let Comment=mongoose.model("Comment");
let Reply=mongoose.model("Reply");
const blogController=require("../controllers/blog-controller");
const questionController=require("../controllers/question-controller");
const mailSender = require("../mail/mail-sender");

let sendBlogCommentNotification = (blogId, mailOptions, next) => {
    //query only published blog in publishedOn descending order with pagination
    let blogQuery=Blog.find({"_id": blogId});
    blogQuery.where("status").eq("published");
    blogQuery.populate("profile");  // load profile instance
    blogQuery.populate({           // populate User instance
        path:"comments",
        populate:{
            path:"commentedBy",
            component:"User",
            distinct: true
        }
    });
    blogQuery.exec()
        .then((blog) => {
            mailOptions.set("blog", blog);
            let recipientSet = new Set();
            blog[0].comments.forEach(comment => {
                // filter the user who has accepted to mail notification
                if (comment.notification) {
                    // don't send this notification to the user who is commenting
                    if (comment.commentedBy._id.toString() !== mailOptions.get("user")._id.toString()) {
                        // adding recipient to set for uniqueness so that the mail notification should be sent to every user only one time
                        recipientSet.add(comment.commentedBy);
                    }
                }
            });
            // now send mail notification to every user
            recipientSet.forEach(recipient => {
                mailOptions.set("recipient", recipient);
                mailSender.sendMail(null, mailOptions, "blog-comment");
            });
        })
        .catch((err) => {
            console.error(err.stack);
            next(err);
        });
};

let sendQuestionCommentNotification = (questionId, mailOptions, next) => {
    //query only published question in publishedOn descending order with pagination
    const questionQuery=Question.find({"_id": questionId});
    questionQuery.where("status").eq("published");
    questionQuery.populate("user");   // load user instance
    questionQuery.populate({          // populate User instance who commented
        path:"comments",
        populate:{
            path:"commentedBy",
            component:"User",
            distinct: "_id"
        }
    });
    questionQuery.exec()
        .then((question) => {
            mailOptions.set("question", question);
            let recipientSet = new Set();
            question[0].comments.forEach(comment => {
                // filter the user who has accepted to mail notification
                if (comment.notification) {
                    // don't send this notification to the user who is commenting
                    if (comment.commentedBy != null && comment.commentedBy._id.toString() !== mailOptions.get("user")._id.toString()) {
                        // adding recipient to set for uniqueness so that the mail notification should be sent to every user only one time
                        recipientSet.add(comment.commentedBy);
                    }
                }
            });
            // now send mail notification to every user
            recipientSet.forEach(recipient => {
                mailOptions.set("recipient", recipient);
                mailSender.sendMail(null,mailOptions, "question-comment");
            });
        })
        .catch((err) => {
            console.error(err.stack);
            next(err);
        });
};

let saveBlogComment=(req, res, next) => {

    const blogId=req.param("blogId");
    const userId=req.param("userId");
    const content=req.body.content;
    let mailOptions = new HashMap();

    //Validate that required fields have been supplied
    if(!blogId || !userId || !content){
        next(res.json({"statusCode":400,message:"Fields[blog id, user id and comment] must be required"}));
        return;
    }

    //load user instance from database
    User.findOne({"_id":userId})
        .then((user) => {
            mailOptions.set("user", user);
            //Create a new comment instance and set its properties
            const newComment=Comment({
                "content": content,
                "commentedBy": user._id,
                "notification": req.param("notification")
            });

            //Save this comment to MongoDB
            newComment.save()
                .then((comment) => {
                    mailOptions.set("comment", comment);
                    //update Blog with comment id
                    const commentId=[comment._id];
                    Blog.update({"_id":blogId},{$push:{comments:{$each:commentId}}},{})
                        .then(() => {
                            // send comment mail notification to the users who accept comment mail notification
                            sendBlogCommentNotification(blogId, mailOptions, next);
                            //call getBlog method that returns updated comment list
                            req.params["_id"] = blogId;
                            blogController.getBlog(req, res, next);
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
        })
        .catch((err) => {
            console.error(err.stack);
            next(err);
        });
};

let editBlogCommentReply=(req, res, next) => {

    const blogId=req.param("blogId");
    const actionType=req.param("actionType");

    const actionId = req.body._id;
    const content = req.body.content;

    if(!blogId && !actionType && !content) {
        next(res.json({"statusCode":400,message:"Fields[question id, action type and content] must be required"}));
        return;
    }

    if (actionType == "comment") {
        Comment.findOneAndUpdate(actionId, {$set: {content: content}})
            .then((comment) => {
                if (comment) {
                    // load updated blog
                    req.params["_id"] = blogId;
                    blogController.getBlog(req, res, next);
                }
            })
            .catch((err) => {
                console.error(err.stack);
                next(err);
            });
    }

    if (actionType == "reply") {
        Reply.findOneAndUpdate(actionId, {$set: {content: content}})
            .then((reply) => {
                if (reply) {
                    // load updated blog
                    req.params["_id"] = blogId;
                    blogController.getBlog(req, res, next);
                }
            })
            .catch((err) => {
                console.error(err.stack);
                next(err);
            });
    }
};

let deleteBlogComment = (req, res, next) => {

    let blogId = req.param("blogId");
    let commentId= req.param("commentId");

    //Validate that required fields
    if(!commentId.length > 0 && !blogId.length > 0){
        next(res.json({"statusCode":400, message:"Fields[comment id and blog id] must be required"}));
        return;
    }

    req.params["_id"] = blogId;

    Comment.findOneAndRemove(commentId)
        .then((comment) => blogController.getBlog(req, res, next)) // lead updated commentList using getBlog
        .catch((err) => {
            console.error(err.stack);
            next(err);
        });
};

let deleteBlogReply = (req, res, next) => {

    let blogId = req.param("blogId");
    let replyId= req.param("replyId");

    //Validate that required fields
    if(!replyId.length > 0 && !blogId.length > 0){
        next(res.json({"statusCode":400, message:"Fields[reply id and blog id] must be required"}));
        return;
    }

    req.params["_id"] = blogId;


    Reply.findOneAndRemove(replyId)
        .then((reply) => blogController.getBlog(req, res, next)) // lead updated commentList using getBlog
        .catch((err) => {
            console.error(err.stack);
            next(err);
        });

};

let saveQuestionComment = (req, res, next) => {

    const questionId=req.param("questionId");
    const userId=req.param("userId");
    const content=req.body.content;
    let mailOptions = new HashMap();

    //Validate that required fields have been supplied
    if(!questionId || !userId || !content){
        next(res.json({"statusCode":400,message:"Fields[question id, user id and comment] must be required"}));
        return;
    }

    //load user instance from database
    User.findOne({"_id":userId})
        .then((user) => {
            mailOptions.set("user", user);
            //Create a new comment instance and set its properties
            const newComment=Comment({
                "content": content,
                "commentedBy": user._id,
                "notification": req.param("notification")
            });

            //Save this comment to MongoDB
            newComment.save()
                .then((comment) => {
                    mailOptions.set("comment", comment);
                    //update question with comment id
                    const commentId=[comment._id];
                    Question.update({"_id":questionId},{$push:{comments:{$each:commentId}}},{})
                        .then(() => {
                            // send comment mail notification to the users who accept comment mail notification
                            sendQuestionCommentNotification(questionId, mailOptions, next);
                            //call getQuestion method that returns updated comment list
                            req.params["_id"] = questionId;
                            questionController.getQuestion(req, res, next);
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
        })
        .catch((err) => {
            console.error(err.stack);
            next(err);
        });
};

let editQuestionCommentReply = (req, res, next) => {

    const questionId=req.param("questionId");
    const actionType=req.param("actionType");

    const actionId = req.body._id;
    const content = req.body.content;

    if(!questionId && !actionType && !content) {
        next(res.json({"statusCode":400,message:"Fields[question id, action type and content] must be required"}));
        return;
    }

    if (actionType == "comment") {
        Comment.findOneAndUpdate(actionId, {$set: {content: content}})
            .then((comment) => {
                if (comment) {
                    // load updated question
                    req.params["_id"] = questionId;
                    questionController.getQuestion(req, res, next);
                }
            })
            .catch((err) => {
                console.error(err.stack);
                next(err);
            });
    }

    if (actionType == "reply") {
        Reply.findOneAndUpdate(actionId, {$set: {content: content}})
            .then((reply) => {
                if (reply) {
                    // load updated question
                    req.params["_id"] = questionId;
                    questionController.getQuestion(req,res);
                }
            })
            .catch((err) => {
                console.error(err.stack);
                next(err);
            });
    }
};

let deleteQuestionCommentAndReply = (req, res, next) => {

    let questionId = req.param("questionId");
    let actionId= req.param("actionId");
    let actionType = req.param("actionType");

    //Validate that required fields
    if(!actionId.length > 0 && !actionType.length > 0){
        next(res.json({"statusCode":400,message:"Fields[action id and type] must be required"}));
        return;
    }

    req.params["_id"] = questionId;

    if(actionType == "question") {
        Question.findOneAndRemove(actionId)
            .then((question) => next(res.json({"statusCode":200,"questionDeleted": true}))) // lead updated commentList using getQuestion
            .catch((err) => {
                console.error(err.stack);
                next(err);
            });
    }

    if(actionType == "comment") {
        Comment.findOneAndRemove(actionId)
            .then((comment) => questionController.getQuestion(req, res, next)) // lead updated commentList using getQuestion
            .catch((err) => {
                console.error(err.stack);
                next(err);
            });
    }

    if(actionType == "reply") {
        Reply.findOneAndRemove(actionId)
            .then((reply) => questionController.getQuestion(req, res, next)) // lead updated commentList using getQuestion
            .catch((err) => {
                console.error(err.stack);
                next(err);
            });
    }
};

const invokeBlogOrQuestion=(operation, req, res, next) => {
    //call getBlog or getQuestion method based on operation that returns updated comment list
    switch (operation) {
        case 'blog': blogController.getBlog(req, res, next);
            break;
        case 'question': questionController.getQuestion(req, res, next);
            break;
    }
};

let saveReply = (req, res, next) => {

    const content=req.body.content;
    const operation=req.query.operation;
    const commentId=req.param("commentId");
    const userId=req.param("userId");
    let mailOptions = new HashMap();

    //Validate that required fields have been supplied
    if(!commentId || !userId || !content){
        next(res.json({"statusCode":400,message:"Fields[user id, comment id and reply content] must be required"}));
        return;
    }

    //load comment instance from database
    const commentQuery=Comment.find({"_id": commentId});
    commentQuery.populate("commentedBy");   // load user instance
    commentQuery.exec()
        .then((comment) => {
            mailOptions.set("comment", comment);
            //Create a new reply instance and set its properties
            const newReply=Reply({
                "content": content,
                "repliedBy": userId
            });

            //Save this reply to MongoDB
            newReply.save()
                .then((reply) => {
                    mailOptions.set("reply", reply);
                    //update Comments with comment id
                    const replyId=[reply._id];
                    Comment.update({"_id":commentId},{$push:{replies:{$each:replyId}}},{})
                        .then(() => {
                            // send comment's reply mail notification to the users who accept comment mail notification
                            User.findOne({"_id": userId})
                                .then((user) => {
                                    mailOptions.set("user", user);
                                    operation === "blog" ? sendBlogCommentNotification(req.param("_id"), mailOptions, next) : sendQuestionCommentNotification(req.param("_id"), mailOptions, next);
                                })
                                .catch((err) => {
                                    console.error(err.stack);
                                    next(err);
                                });

                            // load updated blog/question
                            invokeBlogOrQuestion(operation, req, res, next);
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
        })
        .catch((err) => {
            console.error(err.stack);
            next(err);
        });
};

let saveCommentLike=(req, res, next) => {

    const likedByUser=req.param("userId");
    const operation=req.query.operation;
    const commentId=req.param("commentId");

    //Validate that required fields have been supplied
    if(!likedByUser && !commentId){
        next(res.json({"statusCode":400,message:"Fields[blog id, user id and comment id] must be required"}));
        return;
    }

    //check if the user liked this comment earlier or not
    Comment.find({"_id": commentId})
        .then((comment) => {
            const savedLikedByUser= comment[0].likes.filter(like => like === likedByUser);
            //if user does not like this comment then update database otherwise not
            if (savedLikedByUser.length === 0){
                Comment.update({"_id":commentId},{$push:{likes:{$each:[likedByUser]}}},{})
                    .then(() => invokeBlogOrQuestion(operation, req, res, next)) // load updated blog/question
                    .catch((err) => {
                        console.error(err.stack);
                        next(err);
                    });
            }else{
                // load updated blog/question
                invokeBlogOrQuestion(operation, req, res, next);
            }
        })
        .catch((err) => {
            console.error(err.stack);
            next(err);
        });
};

let saveReplyLike = (req, res, next) => {

    const likedByUser=req.param("userId");
    const operation=req.query.operation;
    const commentId=req.param("commentId");
    const replyId=req.param("replyId");

    //Validate that required fields have been supplied
    if(!likedByUser && !commentId && !replyId){
        next(res.json({"statusCode":400,message:"Fields[blog id, user id, comment id and reply id] must be required"}));
        return;
    }

    //check if the user liked this blog earlier or not
    Reply.find({"_id": replyId})
        .then((reply) => {
            const savedLikedByUser= reply[0].likes.filter(like => like === likedByUser);
            //if user does not like this blog then update database otherwise not
            if (savedLikedByUser.length === 0){
                Reply.update({"_id":replyId},{$push:{likes:{$each:[likedByUser]}}},{})
                    .then(() => invokeBlogOrQuestion(operation, req, res, next)) // load updated blog/question
                    .catch((err) => {
                        console.error(err.stack);
                        next(err);
                    });
            }else{
                // load updated blog/question
                invokeBlogOrQuestion(operation, req, res, next);
            }
        })
        .catch((err) => {
            console.error(err.stack);
            next(err);
        });
};

module.exports = {
    saveBlogComment: saveBlogComment,
    editBlogCommentReply: editBlogCommentReply,
    deleteBlogComment: deleteBlogComment,
    deleteBlogReply: deleteBlogReply,
    saveQuestionComment: saveQuestionComment,
    editQuestionCommentReply: editQuestionCommentReply,
    deleteQuestionCommentAndReply: deleteQuestionCommentAndReply,
    saveReply: saveReply,
    saveCommentLike: saveCommentLike,
    saveReplyLike: saveReplyLike
};