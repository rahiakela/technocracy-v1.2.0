let mongoose=require("mongoose");

//connecting to MongoDB
let dbURI;
if (process.env.NODE_ENV === "prod") {
    dbURI = process.env.PROD_DO_MONGODB_URI;
} else {
    dbURI=process.env.DEV_AWS_MONGODB_URI;
}
mongoose.connect(dbURI);

//monitoring the connection with mongoose connection events
mongoose.connection.on("connected",function(){
    console.log("Mongoose connected to "+dbURI);
});
mongoose.connection.on("error",function(err){
    console.log('Mongoose connection error: ' + err);
});
mongoose.connection.on("disconnected",function(){
    console.log('Mongoose disconnected');
});

//Reusable function to close Mongoose connection
gracefulShutdown = (msg,callback) => {
    mongoose.connection.close(() => {
        console.log('Mongoose disconnected through ' + msg);
        callback();
    });
};

//For nodemon restarts
process.once("SIGUSR2", () => {
    gracefulShutdown("nodemon restart", () => {
        process.kill(process.pid,"SIGUSR2");
    });
});
//For app termination
process.on("SIGINT", () => {
    gracefulShutdown("app termination", () => {
        process.exit(0);
    });
});
//For Heroku app termination
process.on("SIGTERM", () => {
    gracefulShutdown("Heroku app shutdown", () => {
        process.exit(0);
    });
});

//register schemas & models
require("../models/users-model");
require("../models/blog-model");
require("../models/question-model");
require("../models/comment-model");
require("../models/profile-model");