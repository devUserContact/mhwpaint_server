var db = require("./db.js");
var express = require("express");

const app = express();

app.get("/", (req, res) => res.send("test"));

app.get("/mhwpaint/gallery", async function (req, res) {
  let test = await db.connectToServer();
  res.send(test);
});

app.listen(3000, () => console.log("Server ready"));
