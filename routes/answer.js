const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/auth");

const {
    getAllQuestionAnswers,
    addAnswerToQuestion,
    delAnswerById,
    addLikeToAnswer,
    getLikeCount,
    removeLikeFromAnswer,
} = require("../controllers/answer");

// gaunam visus klausimo atsakymus pagal klausimo id
router.get("/question/:id/answers", authMiddleware, getAllQuestionAnswers);
// pridedam klausimui atsakymą 
router.post("/question/:id/answer", authMiddleware, addAnswerToQuestion);
//trinam atsakyma pagal id
router.delete("/answer/:id", authMiddleware, delAnswerById);
//atsakymo like
router.post("/question/:id/answer/:id/like", authMiddleware, addLikeToAnswer);
//atsakymo like kiekis
router.get("/question/:id/answer/:id/likes", authMiddleware, getLikeCount)
//atsakumo like pasalinimas
router.delete("/question/:id/answer/:id/like", authMiddleware, removeLikeFromAnswer);



module.exports = router;