const mongoose=require("mongoose");
const fs=require("fs");
let HashMap = require("hashmap");
let Blog=mongoose.model("Blog");
let Profile=mongoose.model("Profile");
let User=mongoose.model("User");
let Reply=mongoose.model("Reply");
let blogController=require("./blog-controller");
let mailSender = require("../mail/mail-sender");

let getBlogs= (req, res, next) => {

    const perPage=20;
    let page=req.param("page") > 0 ? req.param("page"):0;

    //query only published blog in publishedOn descending order with pagination
    let blogQuery=Blog.find({});
    blogQuery.where("status").eq("published");
    blogQuery.limit(perPage);
    blogQuery.skip(perPage*page);
    blogQuery.sort("-publishedOn");
    blogQuery.populate({     // populate profile instance with user
        path:"profile",
        populate: {
            path: "user",
            component: "User"
        }
    });
    blogQuery.populate({           // populate User instance who commented
        path:"comments",
        populate:{
            path:"commentedBy",
            component:"User"
        }
    });
    blogQuery.populate({          // populate Replys instance
        path:"comments",
        populate:{
            path:"replies",
            component:"Reply",
            populate:{           // populate user who has reply
                path:"repliedBy",
                component:"User"
            }
        }
    });

    blogQuery.exec()
        .then((blogs) => {
            next(res.json({"statusCode": 200, "page": ++page, "blogs": blogs}));
        })
        .catch((err) => next(err))
};

let getBlog=(req, res, next) => {

    //Validate that required fields have been supplied
    if(!req.param("_id")){
        next(res.json({"statusCode":400,message:"Fields[blog id] must be required"}));
        return;
    }

    //query only published blog in publishedOn descending order with pagination
    let blogQuery=Blog.find({"_id":req.param("_id")});
    blogQuery.where("status").eq("published");
    blogQuery.populate({     // populate profile instance with user
        path:"profile",
        populate: {
            path: "user",
            component: "User"
        }
    });
    blogQuery.populate({          // populate User instance
        path:"comments",
        populate:{
            path:"commentedBy",
            component:"User"
        }
    });
    blogQuery.populate({          // populate Replys instance
        path:"comments",
        populate:{
            path:"replies",
            component:"Reply",
            populate:{           // populate user who has reply
                path:"repliedBy",
                component:"User"
            }
        }
    });

    blogQuery.exec()
        .then((blog) => {
           if (blog[0]) {
               next(res.json({"statusCode": 200, 'blog': blog}));
           } else {
               next(res.json({"statusCode": 404, message: `The blog does not exist for ${req.param("_id")}`}));
           }
        })
        .catch((err) => next(err))
};

let getAllBlogs = (req, res, next) => {

    let writtenBy=req.param("writtenBy");

    //query all blog based on profile id
    const blogQuery=Blog.find({"profile": writtenBy});
    blogQuery.populate({     // populate profile instance with user
        path:"profile",
        populate: {
            path: "user",
            component: "User"
        }
    });

    blogQuery.exec()
        .then((blogs) => {
            next(res.json({"statusCode": 200, 'blogs':blogs}));
        })
        .catch((err) => {
            console.error(err.stack);
            next(err);
        });
};

let getPendingBlogList = (req, res, next) => {

    //query all pending blog for review and approval
    const blogQuery=Blog.find({"status": "pending"});
    blogQuery.populate({     // populate profile instance with user
        path:"profile",
        populate: {
            path: "user",
            component: "User"
        }
    });

    blogQuery.exec()
        .then((blogs) => {
            next(res.json({"statusCode": 200, 'blogs':blogs}));
        })
        .catch((err) => {
            console.error(err.stack);
            next(err);
        });
};

let saveBlog=(req, res, next) => {

    const profileId = req.params["profileId"];
    const actionType = req.params["actionType"];
    const title = req.body.title;
    const content = req.body.content;
    const tags = req.body.tags;

    let mailOptions = new HashMap();
    let newBlog = {};

    //Validate that required fields have been supplied
    if(!profileId || !title || !content){
        next(res.json({"statusCode":400,message:"Fields[profileId,title and content] must be required"}));
        return;
    }

    // prepare status and date type accordingly to action type
    if (actionType === 'save') {
        //Create a new blog instance and set its properties
        newBlog=Blog({
            "title": title,
            "content": content,
            "status": "pending",
            "submittedOn": Date.now(),
            "tags": tags,
            "profile": profileId
        });
    } else {
        //Create a new blog instance and set its properties
        newBlog=Blog({
            "title": title,
            "content": content,
            "status": "draft",
            "createdOn": Date.now(),
            "tags": tags,
            "profile": profileId
        });
    }

    //Save this blog to MongoDB
    newBlog.save()
        .then(blog => {
            // populate user with profile and user instance
            Blog.findOne(blog._id)
                .populate({
                    path:"profile",
                    populate: {
                        path: "user",
                        component: "User"
                    }
                })
                .exec()
                .then(blog => {
                    // don't send mail if the blog is saved just as draft
                    if (actionType === 'save') {
                        // send new blog post mail notification to editors
                        mailSender.sendMail(process.env.ADMIN_MAIL_ID, mailOptions.set("blog", blog), "save-blog");
                    }
                    next(res.json({"statusCode": 200, "blog": blog}));
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

let modifyBlog=(req, res, next) => {

    const blogId=req.param("blogId");
    const actionType=req.param("actionType");

    let mailOptions = new HashMap();
    let updateBlog = {};

    if(!blogId) {
        next(res.json({"statusCode":400,message:"Fields[blog id and status] must be required"}));
        return;
    }

    // prepare status and date type accordingly to action type
    switch (actionType) {
        case 'pending':
            updateBlog = {"status": "pending", "updatedOn": Date.now()};
            break;
        case 'on_hold':
            updateBlog = {"status": "on_hold", "holdOnDate": Date.now()};
            break;
        case 'rejected':
            updateBlog = {"status": "rejected", "rejectedOn": Date.now()};
            break;
        case 'published':
            updateBlog = {"status": "published", "publishedOn": Date.now()};
            break;
    }

    // find and update blog with id and populate with profile
    Blog.findOneAndUpdate(
            {"_id": blogId},            // query criteria
            updateBlog,                 // data to update
            {new: true}                 // options: return updated one
        )
        .populate({                     // populate profile instance with user
            path:"profile",
            populate: {
                path: "user",
                component: "User"
            }
        })
        .then(blog => {
            // send blog mail notification to user/subscriber according to action type
            switch (actionType) {
                case 'published':
                    const userQuery = User.find({});
                    userQuery.where("subscription").eq("Y"); // filter the user who has subscribed to mail notification
                    userQuery.exec()
                        .then((users) => {
                            users.forEach(user => {
                                if(user._id.toString() !== blog.profile._id.toString()) { // don't send this notification to the profile who has written this blog
                                    mailSender.sendMail(user, mailOptions.set("blog", blog), "publish-blog");
                                }
                            });
                        })
                        .catch((err) => {
                            console.error(err.stack);
                            next(err);
                        });
                    break;
                case 'pending':
                    // send new blog post mail notification to editors
                    mailSender.sendMail(process.env.ADMIN_MAIL_ID, mailOptions.set("blog", blog), "save-blog");
                    break;
                case 'on_hold':
                    mailSender.sendMail(blog.profile.user, mailOptions.set("blog", blog), "on-hold-blog");
                    break;
                case 'rejected':
                    mailSender.sendMail(blog.profile.user, mailOptions.set("blog", blog), "rejected-blog");
                    break;
            }
            next(res.json({"statusCode": 200, "blog": blog}));
        })
        .catch((err) => {
            console.error(err.stack);
            next(err);
        });
};

let editBlog =(req, res, next) => {

    const blogId=req.param("blogId");
    const title = req.body.title;
    const content = req.body.content;
    const tags = req.body.tags;

    if(!blogId) {
        next(res.json({"statusCode":400,message:"Fields[blog id] must be required"}));
        return;
    }

    Blog.findOneAndUpdate(
            {"_id": blogId}, // query criteria
            {"title": title, "content": content, "tags": tags, status: "draft", "updatedOn": Date.now()},// data to update
            { new: true }  // options: return updated one
        )
        .populate({     // populate profile instance with user
            path:"profile",
            populate: {
                path: "user",
                component: "User"
            }
        })
        .then(blog => {
            next(res.json({"statusCode":200,"blog":blog}));
        })
        .catch((err) => next(err));
};

let discardBlog=(req, res, next) => {

    //Validate that required fields have been supplied
    if(!req.param("blogId")){
        next(res.json({"statusCode":400,message:"Fields[blog id] must be required"}));
        return;
    }

    Blog.findOneAndUpdate(
            {"_id": req.param("blogId")}, // query criteria
            {"status": "inactive", "inactiveDate": Date.now()},       // update data
            { new: true }                 // options: return updated one
        )
        .then((blog) => {
            next(res.json({"statusCode": 200, "blog": blog}));
        })
        .catch((err) => next(err));
};

let getTotalBlog = (req, res, next) => {
    let writtenBy=req.param("writtenBy");

    //get count of all blog based on profile id
    Blog.count({"profile": writtenBy})
        .exec()
        .then((blogCount) => {
            // send blog statistics as response
            next(res.json({totalBlog: blogCount}));
        })
        .catch((err) => {
            next(err);
        });
};
let getTotalPendingBlog = (req, res, next) => {

    //get count of all pending blog
    Blog.count({"status": "pending"})
        .exec()
        .then((blogPendingCount) => {
            next(res.json({totalPendingBlog: blogPendingCount}));
        })
        .catch((err) => {
            next(err);
        });
};

let saveLike=(req, res, next) => {

    const likedByUser=req.param("userId");
    const blogId=req.param("blogId");

    //Validate that required fields have been supplied
    if(!blogId && !likedByUser){
        next(res.json({"statusCode":400,message:"Fields[blog id and user id] must be required"}));
        return;
    }

    let likeByUser=[likedByUser];

    //check if the user liked this blog earlier or not
    Blog.find({"_id": blogId})
        .then((blog) => {

            // set blog id to req
            req.params["_id"] = blogId;

            let savedLikedByUser= blog[0].likes.filter(like => like === likedByUser);

            if (savedLikedByUser.length === 0){ //if user does not like this blog then update database otherwise not
                Blog.update({"_id":blogId},{$push:{likes:{$each:likeByUser}}},{})
                    .then(() => {
                        // load updated blog
                        blogController.getBlog(req,res, next);
                    })
                    .catch((err) => {
                        console.error(err.stack);
                        next(err);
                    })
            }else{
                blogController.getBlog(req, res, next);
            }
        })
        .catch((err) => {
            console.error(err.stack);
            next(err);
        })
};

let search=(req, res, next) => {

    let query=req.param("query");

    //Validate that required fields have been supplied
    if(query.length < 1){
        next(res.json({"statusCode":400,message:"Fields[query] must be required"}));
        return;
    }

    //query only published blog in publishedOn descending order with pagination
    let blogQuery=Blog.find({$text: {$search: query}});
    blogQuery.where("status").eq("published");
    blogQuery.limit(10);
    blogQuery.skip(0);
    blogQuery.sort("publishedOn");
    blogQuery.populate({     // populate profile instance with profile
        path:"profile",
        populate: {
            path: "user",
            component: "User"
        }
    });
    blogQuery.populate({          // populate comment list instance
        path:"comments",
        populate:{                // populate User instance
            path:"commentedBy",
            component:"User"
        }
    });
    blogQuery.populate({
        path:"comments",
        populate:{                // populate Replys instance
            path:"replies",
            component:"Reply",
            populate:{           // populate user who has reply
                path:"repliedBy",
                component:"User"
            }
        }
    });

    blogQuery.exec()
        .then((blogs) => {
            next(res.json({"statusCode": 200, "blogs": blogs}));
        })
        .catch((err) => {
            console.error(err.stack);
            next(err);
        })
};

module.exports = {
    getBlogs: getBlogs,
    getBlog: getBlog,
    getAllBlogs: getAllBlogs,
    getPendingBlogList: getPendingBlogList,
    saveBlog: saveBlog,
    editBlog: editBlog,
    modifyBlog: modifyBlog,
    discardBlog: discardBlog,
    getTotalBlog: getTotalBlog,
    getTotalPendingBlog: getTotalPendingBlog,
    saveLike: saveLike,
    search: search
};

