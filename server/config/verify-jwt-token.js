let jwt = require("jsonwebtoken");

let verifyJWT = (req, res, next) => {
    let token = req.headers["x-access-token"];
    if (!token) {
        next(res.status(401).send({auth: false, message: "No token provided."}));
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            next(res.status(500).send({auth: false, message: "Failed to authenticate token."}));
        }

        // if everything good, then forward the request to actual routes
        next();
    });
};

module.exports = verifyJWT;
