const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/auth");

const {
    getQuestions,
    addQuestion,
    getByIdQuestion,
} = require("../controllers/questions");


// gaunam visus klausimus
router.get("/questions", authMiddleware, getQuestions);
// pridedam klausimą
router.post("/question", authMiddleware, addQuestion);
// trinam klausima pagal id
router.delete("/question/:id", authMiddleware, getByIdQuestion);



module.exports = router;