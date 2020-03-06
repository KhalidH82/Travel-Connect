const express = require("express");
const mongoose = require("mongoose");

const router = express();
const ClientModel = mongoose.model("Client");

router.get("/", (req, res) => {
  ClientModel.find((err, docs) => {
    if (!err) {
      console.log("In DATABASE", docs);
      return res.status(200).send(docs);
    } else {
      console.log(err);
      res.send(err);
    }
  });
});

module.exports = router;
