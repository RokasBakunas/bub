const mongoose = require("mongoose");

const answerSchema = mongoose.Schema({
   answer_text: {type: String, required: true, min:6},
   gained_likes_number: {type: Number},
   id: {type: String, required: true, min: 6} 
});

module.exports = mongoose.model("answer", answerSchema);