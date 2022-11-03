const express = require("express");
const router = express.Router();
const {
  addResponse,
  getAllResponsesToAForm,
  getSingleResponse,
  updateResponse,
  deleteResponse,
} = require("../controllers/response");
const protect = require('../middleware/authMiddleware')

router.route("/form/:formId").post(protect,addResponse).get(getAllResponsesToAForm);

router
  .route("/:responseId")
  .get(getSingleResponse)
  .patch(protect,updateResponse)
  .delete(protect,deleteResponse);


module.exports = router
