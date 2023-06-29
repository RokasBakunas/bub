const express = require("express");
const router = express.Router();
// gaunam visus klausimus
router.get("/questions", getQuestions);
// pridedam klausimą
router.post("/question", addQuestion);
// trinam klausima pagal id
router.delete("/question/:id", getByIdQuestion);



module.exports = router;