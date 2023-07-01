// unikalaus id generavimui
const uniqid = require("uniqid");
// importinam medeli
const questionModel = require("./../models/question");
//pass kodavimas
const bcrypt = require("bcryptjs");
//jwt token
const jwt = require("jsonwebtoken");

module.exports = {
  addQuestion: async (req, res) => {
    const newQuestion = new questionModel({
        question_text: req.body.question_text,
        answers_id: [],
        id: uniqid(),
    });

    try {
        const savedQuestion = await newQuestion.save();
        res.status(200).json(savedQuestion);
    } catch (err) {
        res.status(500).json(err);
    }
},


  getQuestions: async (req, res) => {

  },

  getByIdQuestion: async (req, res) => {

  },
};
