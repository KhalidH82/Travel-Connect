const express = require("express");
const app = express();
const cors = require("cors");
const logger = require(`morgan`);
const bodyParser = require("body-parser");
const secret = "mysecretsshhh";
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const withAuth = require("./middleware/middleware");

const port = process.env.PORT || 5000;

app.use(logger(`dev`));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

const mongoose = require("mongoose");
const mongo_uri = "mongodb://localhost/react-auth";
mongoose.connect(
  mongo_uri,
  { useNewUrlParser: true, useUnifiedTopology: true },

  function(err) {
    if (err) {
      throw err;
    } else {
      console.log(`Successfully connected to ${mongo_uri}`);
    }
  }
);

const User = require("./models/userDB.js");
const Client = require("./models/clientsDB.js");
const ClientsController = require("./contollers/clientController");
const ClientModel = mongoose.model("Client");

// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));

app.use("/clients", ClientsController);

// app.get("/clients/edit/:id", (req, res) => {
//   console.log("IN SERVER-->", req.params.id);

//   Client.findById(req.params.id)
//     .then(res => {
//       console.log(res);
//     })
//     .catch(err => {
//       console.log(err);
//     });
// });

// app.post("/addclient", (req, res) => {
//   console.log(req.body);
//   let client = new ClientModel(req.body);

//   client.fname = req.body.fname;
//   client.lname = req.body.lname;
//   client.email = req.body.clientemail;
//   client.phone = req.body.phone;
//   client.address = req.body.address;
//   client.passport = req.body.passport;
//   client
//     .save()
//     .then(res => {
//       console.log("SAVED!!!---->", res);
//     })
//     .catch(err => {
//       console.log(err);
//     });
// });

// POST route to register a user
app.post("/api/register", function(req, res) {
  const { email, password } = req.body;
  const user = new User({ email, password });
  user.save(function(err) {
    if (err) {
      res.status(500).send("Error registering new user please try again.");
    } else {
      res.status(200).send("Welcome to the club!");
    }
  });
});

app.post("/api/authenticate", function(req, res) {
  const { email, password } = req.body;
  User.findOne({ email }, function(err, user) {
    if (err) {
      console.error(err);
      res.status(500).json({
        error: "Internal error please try again"
      });
    } else if (!user) {
      res.status(401).json({
        error: "Incorrect email or password"
      });
    } else {
      user.isCorrectPassword(password, function(err, same) {
        if (err) {
          res.status(500).json({
            error: "Internal error please try again"
          });
        } else if (!same) {
          res.status(401).json({
            error: "Incorrect email or password"
          });
        } else {
          // Issue token
          const payload = { email };
          const token = jwt.sign(payload, secret, {
            expiresIn: "1h"
          });
          res.cookie("token", token, { httpOnly: true }).sendStatus(200);
        }
      });
    }
  });
});
app.get("/checkToken", withAuth, function(req, res) {
  res.sendStatus(200);
});
