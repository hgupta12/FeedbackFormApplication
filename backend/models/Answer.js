const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
  response: {
    type: mongoose.Types.ObjectId,
    ref: "Response",
    required: true,
  },
  question: {
    type: mongoose.Types.ObjectId,
    ref: "Question",
    required: true,
  },
  text:{
    type:String
  }
});

module.exports = mongoose.model("Answer", answerSchema);
