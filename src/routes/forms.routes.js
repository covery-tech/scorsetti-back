const express = require("express")
const {createForm,editForm, deleteForm, getFormById, tokenLibra} = require("../controllers/forms.controllers");
const { tokenValidation } = require("../lib/validateToken");
const multer = require("multer")
const upload =multer({})
const router = express.Router();


router
    .post("/postForms",createForm)
    .put("/setForms",tokenValidation,editForm)
    .delete("/deleteForms",deleteForm)
    .get("/getById/:formId",getFormById)
    .post("/getToken",upload.single(),tokenLibra)

module.exports = router