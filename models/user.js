const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
   email: {type: String, required: true, min:6},
   password: {type: String, required: true, min: 5},
   name: {type: String, required: true, min: 3},
   asked_questions_ids: {type: Array, required: false},
   id: {type: String, required: true, min: 6} ,
   regDate:  { type: Date, default: Date.now },
});

module.exports = mongoose.model("users", userSchema);