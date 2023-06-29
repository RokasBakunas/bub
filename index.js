const express = require("express");
const app = express();
var cors = require("cors");
const bodyParser = require("body-parser");
const axios = require('axios');


app.use(cors());




app.listen(process.port, () => {
console.log(" API WORK ");
});