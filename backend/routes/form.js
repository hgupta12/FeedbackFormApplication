const express = require("express");
const router = express.Router();
const {
  addForm,
  getSingleForm,
  updateForm,
  deleteForm,
  addQuestion,
  deleteQuestion,
  updateQuestion
} = require("../controllers/form");
const protect  = require('../middleware/authMiddleware')

router.post('/add',protect,addForm);

router
  .route("/:formId")
  .get(getSingleForm)
  .patch(protect,updateForm)
  .delete(protect,deleteForm);

router.post("/question/:formId",protect,addQuestion)

router.delete('/question/delete/:questionId',protect,deleteQuestion)

router.patch('/question/edit/:questionId',protect,updateQuestion )
module.exports = router;
