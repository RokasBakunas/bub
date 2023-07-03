const express = require("express");
const app = express();
const router = express.Router();
// unikalaus id generavimui
const uniqid = require("uniqid");
// importinam medeli
const answerModel = require("./../models/answer");
const questionModel = require("./../models/question");
//pass kodavimas
const bcrypt = require("bcryptjs");
//jwt token
const jwt = require("jsonwebtoken");

module.exports = {
  //pridedant ats į klausimą
  addAnswerToQuestion: async (req, res) => {
    //tikrinam ar atsakymas nera tuscias.
    if (!req.body.answer_text || req.body.answer_text.trim() === "") {
     
      return res
        .status(400)
        .json({
          message: "Atsakymo negalima pridėti, nes jis nėra parašytas.",
        });
    }



    try {
      //gaunam jwt po to dekoduojam ir gaunam vartotojo id
      const decodedToken = jwt.verify(
        req.headers.authorization,
        process.env.ACCESS_TOKEN_SECRET
      );
      userId = decodedToken.id;

    } catch (err) {
      console.log("err", err)
      return res
        .status(401)
        .json({ message: "Nepavyko patikrinti autentifikacijos." });
    }


    const newAnswer = new answerModel({
      answer_text: req.body.answer_text,
      id: uniqid(),
    });

    try {
      console.log("req.params.question_id", req.params.question_id)
      const question = await questionModel.findOne({ id: req.params.question_id });
      console.log("req.params.question_id", req.params.question_id)


      if (!question) {
        return res.status(404).json({ message: "Klausimas nerastas." });
      }
      console.log("err", question, req.body.question_id)
      const savedAnswer = await newAnswer.save();

      question.answers_id.push(savedAnswer.id);
      await question.save();


      res.status(200).json({ message: "Atsakymas sėkmingai pridėtas." });
    } catch (err) {
      console.log("err", err)
      res.status(500).json(err);
    }
  },

  // visi klausimo ats
  getAllQuestionAnswers: async (req, res) => {
    try {
      const answers = await answerModel.find({
        question_id: req.params.id,
      });

      if (answers.length === 0) {
        res
          .status(200).json({message: "Šis klausimas neturi jokių atsakymų. Buk pirmas ir atsakyk."});
      } else { res.status(200).json(answers);}
    } catch (err) {res.status(500).json(err);}
  },

  // del atsakyma pagal id
  delAnswerById: async (req, res) => {
    try {
      // Find the answer to delete
      const answer = await answerModel.findOne({ id: req.params.id });
  
      if (!answer) {
        return res.status(404).json({ message: "Atsakymas nerastas." });
      }
  
      // Delete the answer
      const removedAnswer = await answerModel.deleteOne({ id: req.params.id });
  
      if (removedAnswer.deletedCount > 0) {
        // Find the associated question and remove the answer's id
        const question = await questionModel.findOne({ answers_id: answer.id });
  
        if (question) {
          const index = question.answers_id.indexOf(answer.id);
          if (index !== -1) {
            question.answers_id.splice(index, 1);
            await question.save();
          }
        }
  
        return res.status(200).json({ message: "Atsakymas sėkmingai ištrintas. " });
      } else {
        return res.status(404).json({ message: "Atsakymas nerastas." });
      }
    } catch (err) {
      console.log("err", err);
      res.status(500).json(err);
    }
  },
  

likes: async (req, res) => {
  const { answerId, userId } = req.body;

  try {
      const answer = await Answer.findById(answerId);

      if (!answer) {
          return res.status(404).json({message: 'Atsakymas nerastas'});
      }

      const likes = answer.likes;
      const index = likes.indexOf(userId);

      
      if (index !== -1) {
          likes.splice(index, 1);
          answer.gained_likes_number -= 1;
      } else {
          likes.push(userId);
          answer.gained_likes_number += 1;
      }

      await answer.save();

      res.status(200).json({message: 'Atsakymas atnaujintas', answer});
  } catch (error) {
      console.error(error);
      res.status(500).json({message: 'Įvyko klaida'});
  }
}

}