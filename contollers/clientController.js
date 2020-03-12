const express = require("express");
const mongoose = require("mongoose");
const router = express();
const ClientModel = mongoose.model("Client");

router.get("/clients", (req, res) => {
  ClientModel.find((err, docs) => {
    if (!err) {
      console.log("Getting Clients", docs);
      return res.status(200).send(docs);
    } else {
      console.log(err);
      res.send(err);
    }
  });
});

router.get("/clients/:id", function(req, res) {
  ClientModel.findById(req.params.id, function(err, client) {
    if (!client) {
      res.status(404).send("No result found");
    } else {
      res.json(client);
    }
  });
});

router.post("/addclient", function(req, res) {
  let client = new ClientModel(req.body);
  client
    .save()
    .then(client => {
      res.send(client);
    })
    .catch(function(err) {
      res.status(422).send("Client add failed");
    });
});

router.patch("/clients/:id", function(req, res) {
  ClientModel.findByIdAndUpdate(req.params.id, req.body)
    .then(function() {
      res.json("Client updated");
    })
    .catch(function(err) {
      res.status(422).send("Client update failed.");
    });
});

router.delete("/clients/:id", function(req, res) {
  ClientModel.findById(req.params.id, function(err, client) {
    if (!client) {
      res.status(404).send("Client not found");
    } else {
      ClientModel.findByIdAndRemove(req.params.id)
        .then(function() {
          res.status(200).json("Client deleted");
        })
        .catch(function(err) {
          res.status(400).send("Client delete failed.");
        });
    }
  });
});

module.exports = router;
