const mongoose=require("mongoose");

//defining article schema
let questionSchema=new mongoose.Schema({
    title: {type: String, required: true, unique: true},
    content: {type: String, required: true},
    askedBy: {type: String, ref: "User"},
    createdOn: {type: Date, required: true, default: Date.now()},
    submittedOn: {type: Date, required: false},
    publishedOn: {type: Date, required: false},
    holdOnDate: {type: Date, required: false},
    inactiveDate: {type: Date, required: false},
    rejectedOn: {type: Date, required: false},
    updatedOn: {type: Date, required: false},
    status: {type: String, required: true, default: "pending"},//pending,published,draft,on_hold,rejected and inactive
    comments: [{type: String, ref: "Comment"}],
    likes: [{type: String, ref: "User"}],
    tags: [String],
    voteUp: [{type: String, ref: "User"}],
    voteDown: [{type: String, ref: "User"}]
});
// indexing blog's title and content for full text-search
// ref:https://stackoverflow.com/questions/28775051/best-way-to-perform-a-full-text-search-in-mongodb-and-mongoose
questionSchema.index({title: "text"});

//creating a model from  schema
mongoose.model("Question", questionSchema);