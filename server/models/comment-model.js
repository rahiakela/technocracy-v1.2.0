const mongoose = require("mongoose");

//comment replay model declaration
var replySchema=mongoose.Schema({
    content: {type: String, required: true},
    repliedBy: {type:String, ref: "User"},
    repliedOn: {type: Date, required: true, default:Date.now()},
    likes:[{type: String, ref: "User"}]
});

//comment model declaration
var commentSchema=mongoose.Schema({
    content: {type: String, required: true},
    commentedBy: {type:String, ref: "User"},
    commentedOn: {type: Date, required: true, default:Date.now()},
    likes:[{type: String, ref: "User"}],
    replies: [{type:String, ref: "Reply"}],
    notification: {type: String, required: false}
});

mongoose.model("Reply", replySchema);
mongoose.model("Comment", commentSchema);
