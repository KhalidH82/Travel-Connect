const express = require("express");
const mongoose = require("mongoose");

const router = express();
const ClientModel = mongoose.model("Client");

router
  .get("/", (req, res) => {
    ClientModel.find((err, docs) => {
      if (!err) {
        console.log("In DATABASE", docs);
        return res.status(200).send(docs);
      } else {
        console.log(err);
        res.send(err);
      }
    });
  })

  .delete("/:id", (req, res) => {
    console.log("IN SERVER-->", req.params.id);

    ClientModel.findByIdAndDelete(req.params.id)
      .then(() => res.json("Client deleted!"))
      .catch(err => res.status(400).json("Error: " + err));
  })

  .post("/addclient", (req, res) => {
    console.log(req.body);
    let client = new ClientModel(req.body);

    client.fname = req.body.fname;
    client.lname = req.body.lname;
    client.email = req.body.clientemail;
    client.phone = req.body.phone;
    client.address = req.body.address;
    client.passport = req.body.passport;
    client
      .save()
      .then(res => {
        console.log("SAVED!!!---->", res);
      })
      .catch(err => {
        console.log(err);
      });
  });

module.exports = router;
