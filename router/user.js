const express = require("express");
const router = express.Router();

// registracija
router.post("/register", userReg);
//login
router.post("/login", userLogin);



module.exports = router;