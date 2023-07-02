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

    //pridedam laukeli userId kuriame nurodoma klausimmo autorius (jo id)
    let userId;
    try {
      //gaunam jwt po to dekoduojam ir gaunam vartotojo id ir ji issaugome kartu su klausimu i userId
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
      question_id: req.params.id,
      answerUserId: userId,
    });

    try {
      console.log("req.params.question_id", req.params.question_id)
      const question = await questionModel.findOne({
        id: req.params.question_id,
      }

      
      );

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
      const removedAnswer = await answerModel.deleteOne({ id: req.params.id });
      if (removedAnswer.deletedCount > 0) {
        res.status(200).json({ message: "Atsakymas sėkmingai ištrintas. " });
      } else {
        res.status(404).json({ message: "Atsakymas nerastas." });
      }
    } catch (err) {
      console.log("err", err)
      res.status(500).json(err);
    }
  },

  addLikeToAnswer: async (req, res) => {
    let userId;
    try {
      // Gaunam jwt, po to dekoduojam ir gaunam vartotojo id ir jį saugome kartu su atsakymu į userId
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

    try {
        // Paieška atsakymo, kuriam norima pridėti "like"
        const answer = await answerModel.findOne({ id: req.params.id });
        if (!answer) {
            return res.status(404).json({ message: "Atsakymas nerastas." });
        }

        // Patikriname, ar vartotojas jau paliko "like"
        if(answer.gained_likes_number.includes(userId)) {
            return res.status(400).json({ message: "Jūs jau palikote 'like' šiam atsakymui." });
        }

        // Pridedam "like" į atsakymą
        answer.gained_likes_number.push(userId);
        await answer.save();

        res.status(200).json({ message: "Atsakymas sėkmingai palaikintas." });
    } catch (err) {
      console.log("err", err)
        res.status(500).json(err);

    }
},

getLikeCount: async (req, res) => {
  try {
    const answer = await answerModel.findOne({ id: req.params.id });
    if (!answer) {
        return res.status(404).json({ message: "Atsakymas nerastas." });
    }

    // Grąžiname 'like' kiekį
    res.status(200).json({ likeCount: answer.gained_likes_number.length });
  } catch (err) {
    console.log("err", err)
      res.status(500).json(err);
 
  }
},

removeLikeFromAnswer: async (req, res) => {
  let userId;
  try {
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

  try {
    const answer = await answerModel.findOne({ id: req.params.id });
    if (!answer) {
        return res.status(404).json({ message: "Atsakymas nerastas." });
    }

    // Patikriname, ar vartotojas jau paliko 'like'
    const likeIndex = answer.gained_likes_number.indexOf(userId);
    if (likeIndex === -1) {
        return res.status(400).json({ message: "Jūs dar nepalikote 'like' šiam atsakymui." });
    }

    // Pašaliname 'like'
    answer.gained_likes_number.splice(likeIndex, 1);
    await answer.save();

    res.status(200).json({ message: "Atsakymo 'like' sėkmingai pašalintas." });
  } catch (err) {
    console.log("err", err)
      res.status(500).json(err);
      
  }
}

};