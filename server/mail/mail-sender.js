const nodemailer = require("nodemailer");
let moment = require("moment");

const mailActivateTemplate = require("./template/mail-activate-template");
const welcomeTemplate = require("./template/welcome-template");
const subscribedTemplate = require("./template/subscribed-template");

const blogPublishTemplate = require("./template/blog-publish-template");
const blogSaveTemplate = require("./template/blog-save-template");
const blogOnHoldTemplate = require("./template/blog-onhold-template");
const blogRejectedTemplate = require("./template/blog-rejected-template");

const questionPublishTemplate = require("./template/question-publish-template");
const questionSaveTemplate = require("./template/question-save-template");
const questionOnHoldTemplate = require("./template/question-onhold-template");
const questionRejectedTemplate = require("./template/question-rejected-template");

const commentTemplate = require("./template/comment-template");

const prodErrorTemplate = require("./template/prod-error-template");

module.exports.getUserName=(user) => {
    let username="";

    if(user.local.name !== undefined){
        username = user.local.name;
    }
    if(user.facebook.name !== undefined){
        username = user.facebook.name;
    }
    if(user.google.name !== undefined){
        username = user.google.name;
    }
    if(user.linkedin.name !== undefined){
        username = user.linkedin.name;
    }

    return username;
};

module.exports.getUserEmail=(user) => {
    let email="";

    if(user.local.email !== undefined){
        email = user.local.email;
    }
    if(user.facebook.email !== undefined){
        email = user.facebook.email;
    }
    if(user.google.email !== undefined){
        email = user.google.email;
    }
    if(user.linkedin.email !== undefined){
        email = user.linkedin.email;
    }

    return email;
};

module.exports.getUserIcon = (user) => {

    if (user.local === null) {
        return '';
    }

    if (user.local.image != null) {
        return user.local.image;
    }
    if (user.facebook.image != null) {
        return user.facebook.image;
    }
    if (user.google.image != null) {
        return user.google.image;
    }
    if (user.linkedin.image != null) {
        return user.linkedin.image;
    }

    return '';
};

module.exports.decodeHTML=(text) => {
    return text.replace(/&#(\d+);/g, (match, dec) => {
        return String.fromCharCode(dec);
    });
};


// ref:
// 1-http://javascript.tutorialhorizon.com/2015/07/02/send-email-node-js-express/
// 2-https://stackoverflow.com/questions/4113701/sending-emails-in-node-js
// 3-https://stackoverflow.com/questions/19877246/nodemailer-with-gmail-and-nodejs
module.exports.sendMail = (recipient, mailOption, mailType) => {
    //  create reusable transporter object using the default SMTP transport

    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com", // use gmail smtp host
        service: "Gmail",       // use Gmail mail server
        auth: {                 // use sender credentials
            user: "editors@tecknocracy.com",
            pass: "@kalim#2007"
        }
    });

    let htmlContent = "";
    let fromContent = "";
    let toMailId = recipient;
    // change subject line
    let subject = "Welcome to Technocracy Blog/Question Forum!";

    // identify which template need to send
    switch (mailType) {
        case "save-blog":
            htmlContent = blogSaveTemplate.getSaveBlogMailTemplate(mailOption.get("blog"), recipient);
            fromContent = "Technocracy Blog <editors@tecknocracy.com>";
            subject = `[New Blog Post] ${mailOption.get("blog").title}`;
            toMailId = recipient;
            break;
        case "on-hold-blog":
            htmlContent = blogOnHoldTemplate.getOnHoldBlogMailTemplate(mailOption.get("blog"), recipient, mailOption.get("blog").profile.name);
            fromContent = "Technocracy Question <editors@tecknocracy.com>";
            subject = `[Blog On Hold] ${mailOption.get("blog").title}` ;
            toMailId = this.getUserEmail(recipient);
            break;
        case "rejected-blog":
            htmlContent = blogRejectedTemplate.getRejectedBlogMailTemplate(mailOption.get("blog"), recipient, mailOption.get("blog").profile.name);
            fromContent = "Technocracy Question <editors@tecknocracy.com>";
            subject = `[Blog Rejected] ${mailOption.get("blog").title}`;
            toMailId = this.getUserEmail(recipient);
            break;
        case "publish-blog":
            htmlContent = blogPublishTemplate.getBlogPublishMailTemplate(mailOption.get("blog"), this.getUserEmail(recipient));
            fromContent = "Technocracy Blog <editors@tecknocracy.com>";
            subject = mailOption.get("blog").title;
            toMailId = this.getUserEmail(recipient);
            break;
        case "save-question":
            htmlContent = questionSaveTemplate.getQuestionSaveMailTemplate(mailOption.get("question"), this.getUserName(mailOption.get("question").askedBy));
            fromContent = "Technocracy Question <editors@tecknocracy.com>";
            subject = `[New Question Post] ${mailOption.get("question").title}`;
            toMailId = recipient;
            break;
        case "on-hold-question":
            htmlContent = questionOnHoldTemplate.getOnHoldQuestionMailTemplate(mailOption.get("question"), recipient, this.getUserName(mailOption.get("question").askedBy));
            fromContent = "Technocracy Question <editors@tecknocracy.com>";
            subject = `[Question On Hold] ${mailOption.get("question").title}` ;
            toMailId = this.getUserEmail(recipient);
            break;
        case "rejected-question":
            htmlContent = questionRejectedTemplate.getQuestionRejectedMailTemplate(mailOption.get("question"), recipient, this.getUserName(mailOption.get("question").askedBy));
            fromContent = "Technocracy Question <editors@tecknocracy.com>";
            subject = `[Question Rejected] ${mailOption.get("question").title}`;
            toMailId = this.getUserEmail(recipient);
            break;
        case "publish-question":
            htmlContent = questionPublishTemplate.getQuestionPublishMailTemplate(mailOption.get("question"), recipient, this.getUserName(mailOption.get("question").askedBy));
            fromContent = "Technocracy Question <editors@tecknocracy.com>";
            subject = mailOption.get("question").title;
            toMailId = this.getUserEmail(recipient);
            break;
        case "blog-comment":
            recipient = this.getUserEmail(mailOption.get("recipient"));
            htmlContent = commentTemplate.getCommentMailTemplate(mailOption, recipient, "blog");
            fromContent = "Technocracy Blog <editors@tecknocracy.com>";
            subject = `[New Blog Comment] ${mailOption.get("blog")[0].title}`;
            toMailId = recipient;
            break;
        case "question-comment":
            recipient = this.getUserEmail(mailOption.get("recipient"));
            htmlContent = commentTemplate.getCommentMailTemplate(mailOption, recipient, "question");
            fromContent = "Technocracy Question <editors@tecknocracy.com>";
            subject = `[New Question Comment] ${mailOption.get("question")[0].title}`;
            toMailId = recipient;
            break;
        case "welcome-mail":
            fromContent = "Technocracy Forum <editors@tecknocracy.com>";
            htmlContent = welcomeTemplate.getWelcomeTemplate(recipient);
            break;
        case "activate-mail":
            fromContent = "Technocracy Forum <editors@tecknocracy.com>";
            htmlContent = mailActivateTemplate.getMailActivateTemplate(recipient, mailOption.get("activateToken"));
            subject = "[Technocracy Forum] Verify your mail id to activate  your account";
            break;
        case "subscribed":
            fromContent = "Technocracy Forum <editors@tecknocracy.com>";
            htmlContent = subscribedTemplate.getSubscribedTemplate(recipient);
            break;
        case "error-notification":
            fromContent = "Technocracy Production Error <editors@tecknocracy.com>";
            subject = "Technocracy Production Error!";
            htmlContent = prodErrorTemplate.getProdErrorTemplate(recipient, mailOption);
            break;
    }

    // setup email data with unicode symbols
    let mailOptions = {
        from: fromContent,    // sender address
        to: toMailId,         // list of receivers
        subject: subject,     // Subject line is blog's title
        html: htmlContent     // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions)
        .then((response) => console.log("Mail has been sent to ", toMailId))
        .catch((err) => console.error(err.stack));

    // close transporter
    transporter.close();
};
