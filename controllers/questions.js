// unikalaus id generavimui
const uniqid = require("uniqid");
// importinam medeli
const questionModel = require("./../models/question");
//pass kodavimas
const bcrypt = require("bcryptjs");
//jwt token
const jwt = require("jsonwebtoken");

module.exports = {
  //prideti klausima
  addQuestion: async (req, res) => {
    //tikrinam ar nėra tusčias
    if (!req.body.question_text || req.body.question_text.trim() === "") {
      return res
        .status(400)
        .json({
          message: "Klausimo negalima pridėti, nes jis nėra parašytas.",
        });
    }
    //tikrinam ar klausimo simboliu ilgis yra ne mažesnis nei 10
    if (req.body.question_text.length < 10) {
      return res
        .status(400)
        .json({ message: "Klausimas turi būti bent 10 simbolių ilgio." });
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
      console.log(userId);
    } catch (err) {
      return res
        .status(401)
        .json({ message: "Nepavyko patikrinti autentifikacijos." });
    }

    const newQuestion = new questionModel({
      question_text: req.body.question_text,
      answers_id: [],
      id: uniqid(),
      userId: userId,
    });

    try {
      const savedQuestion = await newQuestion.save();
      res.status(200).json({ message: "Klausimas sėkmingai pridėtas." });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // visi klausimai


//   getQuestions: async (req, res) => {
//     try {
//       const questions = await questionModel.find();
//       res.status(200).json(questions);
//     } catch (err) {
//       res.status(500).json(err);
//       console.log(err);
//     }
//   },

// visi klausimai
getQuestions: async (req, res) => {
  try {
    const questions = await questionModel.aggregate([
      {
        $lookup: {
          from: 'users', 
          localField: 'userId',
          foreignField: 'id',
          as: 'userName',
        },
      },
      {
        $addFields: {
          userName: { $arrayElemAt: ["$userName.name", 0] },
        },
      },
      {
        $project: {
          question_text: 1,
          answers_id: 1,
          id: 1,
          userName: 1,
        },
      },
    ]);
    res.status(200).json(questions);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
},









  //klausimo gavimas pagal id
  getByIdQuestion: async (req, res) => {
    try {
      const question = await questionModel.findOne({ id: req.params.id });
      if (question) {
        res.status(200).json(question);
      } else {
        res.status(404).json({ message: "Toks klausimas nerastas" });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },

  delQuestionById: async (req, res) => {
    try {
      const removedQuestion = await questionModel.deleteOne({
        id: req.params.id,
      });
      if (removedQuestion.deletedCount > 0) {
        res.status(200).json({ message: "Klausimas sėkmingai ištrintas. " });
      } else {
        res.status(404).json({ message: "Klausimas nerastas." });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },

  filterQuestions: async (req, res) => {
    try {
      let questions;
      if (req.params.answered === 'true') {
        // klausimai tik su ats
        console.log("true");
        questions = await questionModel.find({ answers_id: { $exists: true, $not: { $size: 0 } } });
      console.log("questions!", questions)
      } else if (req.params.answered === 'false') {
        // klausimai tik be ats
        console.log("False");
        questions = await questionModel.find({ answers_id: { $exists: true, $size: 0 } });
      } else {
        // jei blogai nurodyta, visi ats
        questions = await questionModel.find({});
      }
      res.status(200).json(questions);
      console.log("questionsa",questions)
    } catch (err) {
      res.status(500).json(err);
    }
  },
 


};
