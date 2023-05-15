const express = require("express");

const r = express.Router();

r.get("/", express.static("client/dist"));

r.post("/transcribe", (req, res) => {
  try {
    const message = req.body.message;
    console.log(req.body);
    res.send({ message: `${message} transcribed` });
  } catch (error) {
    console.log(error.message);
    res.status(500).send(`${message} transcribed`);
  }
});

module.exports = r;
