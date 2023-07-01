const mongoose = require("mongoose");

const questionSchema = mongoose.Schema({
   question_text: {type: String, required: true, min:6},
   answers_id: {type: Array},
   id: {type: String, required: true, min: 6},
   userId: {type: String, required: true}
});

module.exports = mongoose.model("question", questionSchema);