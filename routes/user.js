const express = require("express");
const router = express.Router();

const {
    userReg,
    userLogin,
} = require("../controllers/user");

// registracija
router.post("/register", userReg);
//login
router.post("/login", userLogin);



module.exports = router;