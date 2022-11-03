const asyncHandler = require("express-async-handler");
const Form = require('../models/Form')
const mongoose = require('mongoose')
const Question = require('../models/Question')
const User = require("../models/User");
const mailer = require('../config/mail');

const addForm = asyncHandler(async (req, res) => {
    const {title} = req.body;
   const userId = mongoose.Types.ObjectId(req.user.id);
  const newForm = await Form.create({
    title,
    user:userId,
  });
  if (newForm) {
    const user = await User.findById(req.user.id)
        .select("name email")
        .lean();
    const responseHTML = `<h1>${user.name}, you created a form!</h1>! <p>Send this form to others from your dashboard!</p> `;
    const message = {
      to: user.email,
      from: "sxgean@block521.com",
      subject: "You created a new form!",
      text: `${user.name}, you created a form!`,
      html: responseHTML,
    };
    await mailer.send(message);
    res.status(201).json({ ...newForm._doc });
  } else res.status(400).json({ msg: "Something went wrong" });
});


const getSingleForm = asyncHandler(async (req, res) => {
    const {formId} = req.params
    if (!mongoose.isValidObjectId(formId)) {
      res.status(400);
      throw new Error("Invalid Form Id");
    }
    const form = await Form.findById(formId).populate('user').lean()
    const questions = await Question.find({form:mongoose.Types.ObjectId(formId)}).lean()
    // TODO - remove form id from questions
    if (form && questions) res.status(200).json({ ...form ,questions});
    else {
      res.status(400);
      throw new Error("Something went wrong!");
    }
});

const addQuestion = asyncHandler(async (req, res) => {
    const { text,userId,required } = req.body;
    // get user id from form id
   const formId = mongoose.Types.ObjectId(req.params.formId);
    if(req.user.id == userId){
        const newQuestion = await Question.create({
          text,
          form: formId,
          required
        });
        if (newQuestion) {
          res.status(201).json({ ...newQuestion._doc });
        } else res.status(400).json({ msg: "Something went wrong" });
    }
    else {
        res.status(403)
        throw new Error("Only creator of the form can add questions")
    }
});

const updateQuestion = asyncHandler(async(req,res)=>{
    const {text,required} = req.body;
   const questionId = req.params.questionId;
   if (!mongoose.isValidObjectId(questionId)) {
     res.status(400);
     throw new Error("Invalid Question Id");
   }
   const question = await Question.findById(questionId).populate("form").lean();
   if (question && question.form.user == req.user.id) {
     const updatedQuestion = await Question.findByIdAndUpdate(
       questionId, {text,required},{new:true, runValidators:true}
     ).lean();
     // add code to delete all responses related to this question
     if (updatedQuestion) res.status(200).json({ ...updatedQuestion });
     else res.status(400);
     throw new Error("Something went wrong!");
   } else {
     res.status(403);
     throw new Error(
       "Only creator of the form can update a question from the form."
     );
   }
})

const deleteQuestion = asyncHandler(async (req, res) => {
    const questionId = req.params.questionId;
    if (!mongoose.isValidObjectId(questionId)) {
      res.status(400);
      throw new Error("Invalid Question Id");
    }
    const question = await Question.findById(questionId).populate('form').lean()
    if(question && (question.form.user == req.user.id)){
        const deletedQuestion = await Question.findByIdAndDelete(questionId).lean()
        // add code to delete all responses related to this question
        if(deletedQuestion)
            res.status(200).json({msg:'Question deleted'})
        else
            res.status(400)
            throw new Error("Something went wrong!")
    }
    else{
        res.status(403)
        throw new Error('Only creator of the form can delete a question from the form.')
    }
    
});
const updateForm = asyncHandler(async (req, res) => {
    const {title} = req.body
    const formId = req.params.formId
    const form = await Form.findById(formId).lean()
        console.log(form);
    if(form.user._id == req.user.id){
        const updatedForm = await Form.findByIdAndUpdate(formId,{title},{
            runValidators:true,
            new:true
        }).lean()
        if(updatedForm){
            res.status(200).json({...updatedForm})
        }else{
            res.status(400)
            throw new Error('Something went wrong!')
        }
    }else{
        res.status(403);
        throw new Error(
          "Only creator of the form can update the title."
        );
    }
});
const deleteForm = asyncHandler(async (req, res) => {
    const formId = req.params.formId;
    const form = await Form.findById(formId).lean();
    if (form.user == req.user.id) {
      const deletedForm =await Form.findByIdAndDelete(formId).lean();
    //   add code to delete all responses and questions related to this form
      if (deletedForm) {
        res.status(200).json({ ...deletedForm });
      } else {
        res.status(400);
        throw new Error("Something went wrong!");
      }
    } else {
      res.status(403);
      throw new Error("Only creator of the form can delete this form.");
    }
});


module.exports = {addForm,getSingleForm,updateForm,deleteForm,addQuestion,deleteQuestion,updateQuestion }
