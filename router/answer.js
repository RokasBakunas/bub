const express = require("express");
const router = express.Router();

const {
    getAllQuestionAnswers,
    addAnswerToQuestion,
    delAnswerById,
} = require("./../controllers/answer");

// gaunam visus klausimo atsakymus pagal klausimo id
router.get("/question/:id/answers", getAllQuestionAnswers);
// pridedam klausimui atsakymą 
router.post("/question/:id/answer", addAnswerToQuestion);
//trinam atsakyma pagal id
router.delete("/answer/:id", delAnswerById);



module.exports = router;