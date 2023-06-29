const express = require("express");
const app = express();
var cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");
require("dotenv").config();
const mongoose = require("mongoose");

// routes

const user = require("./router/user");
const questions = require("./router/questions");
const answer = require("./router/answer")

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(user);
app.use(questions);
app.use(answer);














mongoose
  .connect(process.env.MONGO_CONNECT)
  .then(() => {
    console.log("Connect OK");
  })
  .catch((err) => {
    console.log("err", err);
  });



app.listen(process.port, () => {
  console.log(" API WORK ");
});
