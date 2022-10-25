const mongoose = require("mongoose");

const responseSchema = new mongoose.Schema({
  form: {
    type: mongoose.Types.ObjectId,
    ref: "Form",
    required: true,
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref:'User',
    required: true,
  },
  createdAt:{
    type:Date,
    default:Date.now()
  }
});

module.exports = mongoose.model("Response", responseSchema);
