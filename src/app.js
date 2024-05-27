var express = require("express");
var cors = require("cors");
var db = require("./db.js");

const app = express();

var corsOptions = {
  origin: "http://localhost:3001",
  optionsSuccessStatus: 200,
};

app.get("/", cors(corsOptions), (req, res) => res.send("test"));

app.get("/mhwpaint/gallery", cors(corsOptions), async function (req, res) {
  let gallery = await db.connectToServer();
  res.send(gallery);
});

app.listen(3000, () => console.log("Server ready"));
