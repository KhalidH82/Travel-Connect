const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
  clientemail: { type: String },
  fname: { type: String },
  lname: { type: String },
  phone: { type: String },
  address: { type: String },
  passport: { type: String }
});

module.exports = mongoose.model("Client", clientSchema);
