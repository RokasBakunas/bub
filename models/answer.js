const mongoose = require("mongoose");

const answerSchema = mongoose.Schema({
   answer_text: {type: String, required: true, min:6},
   gained_likes_number: {type: Number, default: 0},
   likes: {type: Array, default: []}, 
   id: {type: String, required: true, min: 6},
   addDate:  { type: Date, default: Date.now },
      });

module.exports = mongoose.model("answer", answerSchema);