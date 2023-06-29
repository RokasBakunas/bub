const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {


    const token = req.headers.authorization;

    // autorizacija pagal token ir gaunamas sarasas tik su token/prisijungus
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
        // console.log("User id", decoded.id);
        if (err) {
            return res.status(401).json({ response: "Autorizacijos klaida" });
        } else {
            // console.log("User id", decoded.id);
            req.body.id = decoded.id;
            return next();
        }
    });
};