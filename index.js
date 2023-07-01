const express = require("express");
const app = express();
const router = express.Router();
var cors = require("cors");
const bodyParser = require("body-parser");
// const axios = require("axios");
require("dotenv").config();
const mongoose = require("mongoose");

// routes

const userRouter = require("./routes/user");
const questionsRouter = require("./routes/questions");
const answerRouter = require("./routes/answer");



app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(userRouter);
app.use(questionsRouter);
app.use(answerRouter);




app.get('/', (request, response) => {
    response.send('<h1 style="text-align: center;">BUB - Baigiamoji užduotis: Back-end</h1>')
  });









mongoose
  .connect(process.env.MONGO_CONNECT)
  .then(() => {
    console.log("Connect OK");
  })
  .catch((err) => {
    console.log("err", err);
  });



app.listen(process.env.PORT || 3000, () => {
  console.log(" API WORK ");
  console.log("port",process.env.PORT)
});
