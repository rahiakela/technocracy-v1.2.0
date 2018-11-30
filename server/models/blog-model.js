const mongoose = require("mongoose");

//blog model declaration
const blogSchema = mongoose.Schema({
    title: {type: String, required: true, unique: true},
    description: {type: String, required: false, default: ""},
    content: {type: String, required: true},
    profile: {type: String, ref: "Profile"},
    createdOn: {type: Date, required: true, default: Date.now()},
    submittedOn: {type: Date, required: false},
    publishedOn: {type: Date, required: false},
    holdOnDate: {type: Date, required: false},
    inactiveDate: {type: Date, required: false},
    rejectedOn: {type: Date, required: false},
    updatedOn: {type: Date, required: false},
    image: {type: String, required: false, default: ""},
    status: {type: String, required: true, default: 'pending'},//pending,published,draft,on_hold,inactive and rejected
    comments: [{type: String, ref: "Comment"}],
    likes: [{type: String, ref: "User"}],
    tags: [String]
});

// indexing blog's title and content for full text-search
// ref:https://stackoverflow.com/questions/28775051/best-way-to-perform-a-full-text-search-in-mongodb-and-mongoose
blogSchema.index({title: "text"});

mongoose.model("Blog", blogSchema);
