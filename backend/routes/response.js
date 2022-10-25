const express = require("express");
const router = express.Router();
const {
  addResponse,
  getAllResponsesToAForm,
  getSingleResponse,
  updateResponse,
  deleteResponse,
} = require("../controllers/response");

router.route("/:formId").post(addResponse).get(getAllResponsesToAForm);

router
  .route("/:formId/:responseId")
  .get(getSingleResponse)
  .patch(updateResponse)
  .delete(deleteResponse);

module.exports = router
