const mongoose = require("mongoose");

const answerSchema = mongoose.Schema({
   answer_text: {type: String, required: true, min:6},
   gained_likes_number: {type: Array},
   id: {type: String, required: true, min: 6},
   addDate:  { type: Date, default: Date.now },
      });

module.exports = mongoose.model("answer", answerSchema);