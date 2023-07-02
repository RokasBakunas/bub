const mongoose = require("mongoose");

const answerSchema = mongoose.Schema({
   answer_text: {type: String, required: true, min:6},
   gained_likes_number: {type: Array},
   id: {type: String, required: true, min: 6},
   question_id: {type: String, required: false},
   answerUserId: {type: String, required: true}
});

module.exports = mongoose.model("answer", answerSchema);