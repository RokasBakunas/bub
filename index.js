const express = require("express");
const app = express();
var cors = require("cors");
const bodyParser = require("body-parser");

app.use(cors());





app.listen(process.port,() => {
console.log("APP WORK");
});