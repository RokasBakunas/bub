const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
   email: {type: String, required: true, min:6},
   password: {type: String, required: true, min: 5},
   name: {type: String, required: true, min: 3},
   asked_questions_ids: {type: Number, required: false},
   id: {type: String, required: true, min: 6} 
});

module.exports = mongoose.model("user", userSchema);