const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/auth");

const {
    getQuestions,
    addQuestion,
    getByIdQuestion,
    delQuestionById,
    filterQuestions,

} = require("../controllers/questions");


// gaunam visus klausimus
router.get("/questions", authMiddleware, getQuestions);
// pridedam klausimą
router.post("/question", authMiddleware, addQuestion);

// gaunam klausima pagal id
router.get("/question/:id", authMiddleware, getByIdQuestion);

// trinam klausima pagal id
router.delete("/question/:id", authMiddleware, delQuestionById);

// tik su atsakymais arba tik be atsakymu true/false
router.get("/questions/answered=:answered", authMiddleware, filterQuestions);



module.exports = router;