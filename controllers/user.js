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
    // masyvas klaidoms
    let errors = [];

    // ar yra @ email
    if (!req.body.email.includes("@")) {
      errors.push("El. pašto adresas yra be @");
    }

    //tikrina ar pass ilgis ilgesnis nei 6 ir ar yra skaiciu
    if (req.body.password.length < 6 || !/\d/.test(req.body.password)) {
      errors.push("Slaptažodis turi susidaryti iš raidžių ir skaičių ir buti bent 6 simbolių ilgio.");
    }

    const existingUser = await userModel.findOne({ email: req.body.email });
  
    if (existingUser) {
      errors.push("Vartotojas tokių el. paštu jau yra registruotas.");
    }

    // klaidų masyvo rodymas
    if (errors.length > 0) {
        return res.status(400).json({ response: errors });
      }


    // pass uzkodavimas
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);
    //

    const user = new userModel({
      id: uniqid(),
      email: req.body.email,
      password: hash,
      name: req.body.name,
    });
    await user.save();

    const token = jwt.sign({
      email: user.email,
      id: user.id,
    },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" },
      {
        algorithm: "RS256"
      });

    const refreshToken = jwt.sign(
      {
        email: user.email,
        id: user.id,
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "2d" }
    );


    res.status(200).json({ response: "Registracija pavyko." });
  } catch (err) {
    console.log("err", err);
    res.status(500).json({ response: "Blogai... Klaida..." });
  }
};

module.exports.userLogin = async (req, res) => {};
