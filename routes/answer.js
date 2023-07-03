const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/auth");

const {
    getAllQuestionAnswers,
    addAnswerToQuestion,
    delAnswerById,
    likes,
    removeLikeFromAnswer,
} = require("../controllers/answer");

// gaunam visus klausimo atsakymus pagal klausimo id
router.get("/question/:id/answers", authMiddleware, getAllQuestionAnswers);
// pridedam klausimui atsakymą 
router.post("/question/answer/:question_id", authMiddleware, addAnswerToQuestion);
//trinam atsakyma pagal id
router.delete("/answer/:id", authMiddleware, delAnswerById);
//atsakymo like
router.post("/answer/like", authMiddleware, likes);




module.exports = router;