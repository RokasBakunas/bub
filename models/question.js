const mongoose = require("mongoose");

const questionSchema = mongoose.Schema({
   question_text: {type: String, required: true, min:6},
   answers_id: {type: Number},
   id: {type: String, required: true, min: 6} 
});

module.exports = mongoose.model("question", questionSchema);