const asyncHandler = require("express-async-handler");

const addResponse = asyncHandler(async (req, res) => {});

const getAllResponsesToAForm = asyncHandler(async (req, res) => {});
const getSingleResponse = asyncHandler(async (req, res) => {});
const updateResponse = asyncHandler(async (req, res) => {});
const deleteResponse = asyncHandler(async (req, res) => {});

module.exports = { addResponse,getAllResponsesToAForm,getSingleResponse,updateResponse,deleteResponse }
