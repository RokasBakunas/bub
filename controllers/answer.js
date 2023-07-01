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
        if (!req.body.answer_text || req.body.answer_text.trim() === '') {
            return res.status(400).json({ message: 'Atsakymo negalima pridėti, nes jis nėra parašytas.' });
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


    
        const newAnswer = new answerModel({
            answer_text: req.body.answer_text,
            id: uniqid(),
            question_id: req.body.question_id,
            answerUserId: userId,
        });
    
        try {
            const question = await questionModel.findOne({ id: req.body.question_id });
            if (!question) {
                return res.status(404).json({ message: 'Klausimas nerastas.' });
            }
            const savedAnswer = await newAnswer.save();
            question.answers_id.push(savedAnswer.id);
            await question.save();
            res.status(200).json({ message: 'Atsakymas sėkmingai pridėtas.' });
        } catch (err) {
            res.status(500).json(err);
        }
    },



// visi klausimo ats
getAllQuestionAnswers: async (req, res) => {
    try {
        const answers = await answerModel.find({ question_id: req.params.question_id });
        res.status(200).json(answers);
    } catch (err) {
        res.status(500).json(err);
    }
},


// del atsakyma pagal id
delAnswerById: async (req, res) => {
    try {
        const removedAnswer = await answerModel.deleteOne({ id: req.params.id });
        if (removedAnswer.deletedCount > 0) {
            res.status(200).json({ message: 'Atsakymas sėkmingai ištrintas. ' });
        } else {
            res.status(404).json({ message: 'Atsakymas nerastas.' });
        }
    } catch (err) {
        res.status(500).json(err);
    }
}

}