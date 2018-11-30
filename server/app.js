let express = require('express');
let path = require('path');
let logger = require('morgan');
let bodyParser = require('body-parser');
const dotenv=require("dotenv");
let cookieParser = require('cookie-parser');
let compression = require('compression');
const cors = require('cors');
let mailSender = require("./mail/mail-sender");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yml");

//Load environment variables from .env file, where API keys and passwords are configured.
dotenv.load({path:".env"});

//Require Passport before model definition
let passport=require("passport");
//adding database configuration
require("./config/db-config");
//Require strategy after model definition
require("./config/passport");

//load route modules
const AUTH_ROUTE = require("./routes/auth-routes");
const PROFILE_ROUTE = require("./routes/profile-routes");
const BLOG_ROUTE = require("./routes/blog-routes");
const QUESTION_ROUTE = require("./routes/question-routes");
const COMMENT_ROUTE = require("./routes/comment-routes");

let app = express();

// Enable All CORS Requests
app.use(cors());

//hooks the compression module into the web server.
app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//must use cookieParser before expressSession
app.use(cookieParser());

// Cross Origin middleware
app.use((req,res,next) => {
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
    next();
});
/*app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
        return res.status(200).json({});
    }
    next();
});*/

app.use(express.static(path.join(__dirname, "public")));

//Passport should be initialized in app.js after the static routes have been defined
//and before the routes that are going to use authentication
app.use(passport.initialize());

// load swagger doc api
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//routing all request to REST-API
app.use("/", AUTH_ROUTE);
app.use("/", BLOG_ROUTE);
app.use("/", QUESTION_ROUTE);
app.use("/", PROFILE_ROUTE);
app.use("/", COMMENT_ROUTE);

//Add catchall app.use function to respond to any requests that make it this far by sending HTML file
app.use((req, res) => {
    res.sendFile(path.join(__dirname,"public","index.html"));
});

//Catch unauthorised errors
app.use((err, req, res, next) => {
    if(err.name === "UnauthorizedError"){
        res.status(401);
        res.json({"message":err.name+":"+err.message});
    }
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// general error handler
app.use((err, req, res, next) => {
    console.error(err.message);
    console.error(err.stack);
    // send the error message to client
    res.json({"status": 500, message: err.message});
});

// production unknown error mail notification to admin
if (process.env.NODE_ENV === 'prod') {
    process.on('uncaughtException', (err) => {
        console.error(err.stack);
        // send mail notification
        mailSender.sendMail(process.env.ADMIN_MAIL_ID, err, 'error-notification');
    });
}

module.exports = app;