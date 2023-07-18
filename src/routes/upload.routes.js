const express = require('express');
const{uploadMoto, uploadCSV, upload} = require('../controllers/csvLoader.controllers');
const router = express.Router();

router
    .post("/postMotos", upload, uploadCSV, uploadMoto )

module.exports = router