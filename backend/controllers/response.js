const asyncHandler = require("express-async-handler");
const Answer = require("../models/Answer");
const Question = require("../models/Question");
const Response = require("../models/Response");
const User = require("../models/User");
const mongoose = require("mongoose");
const mailer = require('../config/mail');

const addResponse = asyncHandler(async (req, res) => {
  const { formId } = req.params;
  const userId = mongoose.Types.ObjectId(req.user.id);
  if (!mongoose.isValidObjectId(formId)) {
    res.status(400);
    throw new Error("Invalid Form Id");
  }
  const response = await Response.create({ form: formId, user: userId });
  if (response) {
    // get list of questions
    const questions = await Question.find({ form: formId }).lean();
    //   req.body["questionId"] = answerText
    const data = questions.map((question) => {
      return {
        response: response._doc._id,
        question: question._id,
        text: req.body[question._id],
      };
    });
    const answers = await Answer.insertMany(data);
    if (answers) {
      res.status(201).json([ ...answers ]);
      const user = await User.findById(req.user.id).select('name email').lean();
      const list = questions.map(item=>`<li>
        <p>${item.text}</p>
        <p>${req.body[item._id] || "Not filled"}</p>
      </li>`).join('')
      const responseHTML = `<h1>${user.name}, you submitted a response!</h1> <ul>${list}</ul> `;
      const message = {
        to: user.email,
        from: "sxgean@block521.com",
        subject: "Your response has been submitted!",
        text: `${user.name}, you submitted the form!`,
        html: responseHTML,
      };
     await mailer.send(message)
    } else {
      res.status(400);
      throw new Error("Something went wrong");
    }
  } else {
    res.status(400);
    throw new Error("Something went wrong");
  }
});
const getAllResponsesToAForm = asyncHandler(async (req, res) => {
  const { formId } = req.params;
  if (!mongoose.isValidObjectId(formId)) {
    res.status(400);
    throw new Error("Invalid Form Id");
  }
  const responses = await Response.find({
    form: mongoose.Types.ObjectId(formId),
  })
    .populate(["form", "user"])
    .lean();
  if (responses) {
    res.status(200).json([...responses]);
  } else res.status(400).json({ msg: "Something went wrong" });
});

const getSingleResponse = asyncHandler(async (req, res) => {
  const { responseId } = req.params;
  if (!mongoose.isValidObjectId(responseId)) {
    res.status(400);
    throw new Error("Invalid Form Id");
  }
  const answers = await Answer.find({ response: responseId })
    .select("_id question text")
    .populate("question", ["_id", "text", "required"])
    .lean();
  const response = await Response.findById(responseId)
    .populate(["form", "user"])
    .lean();
  if (answers && response) res.status(200).json({ ...response, answers });
  else {
    res.status(400);
    throw new Error("Something went wrong!");
  }
});


const updateResponse = asyncHandler(async (req, res) => {
    const { responseId } = req.params;
    if (!mongoose.isValidObjectId(responseId)) {
      res.status(400);
      throw new Error("Invalid Form Id");
    }
    // TODO - Update all answers
});

const deleteResponse = asyncHandler(async (req, res) => {
    const { responseId } = req.params;
    if (!mongoose.isValidObjectId(responseId)) {
      res.status(400);
      throw new Error("Invalid Form Id");
    }
    const answers = await Answer.find({ response: responseId }).select('_id').lean()
    const deleteIds = answers.map(answer=>answer._id)
    await Answer.deleteMany({_id:{$in:deleteIds}})
    const deletedResponse = await Response.findByIdAndDelete(responseId).lean()
    if(deleteResponse){
        res.status(200).json({...deletedResponse})
    }
    else{
        res.status(400);
        throw new Error("Something went wrong!");
    }
});

module.exports = {
  addResponse,
  getAllResponsesToAForm,
  getSingleResponse,
  updateResponse,
  deleteResponse,
};
