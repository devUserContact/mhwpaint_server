import db from "./db.js";
import express from "express";
const app = express();

db.asyncFunction;
app.get("/", (req, res) => res.send("final test!"));
app.listen(3000, () => console.log("Server ready"));
