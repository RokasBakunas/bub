// unikalaus id generavimui
const uniqid = require("uniqid");
// importinam medeli 
const userModel = require("./../models/user");
//pass kodavimas
const bcrypt = require("bcryptjs");
//jwt token 
const jwt = require("jsonwebtoken");





module.exports.userReg = async (req, res) => {
try {
    // pass uzkodavimas
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);
    //


    const user = new userModel({
        id: uniqid(),
        email: req.body.email,
        password:hash,
        name: req.body.name
    });
await user.save();


res.status(200).json({ response: "Registracija pavyko."});

}


catch (err) {
    console.log("err", err);
    res.status(500).json({ response: "Blogai... Klaida..." });
}
}






module.exports.userLogin = async (req, res) => {

}






