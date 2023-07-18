const express = require("express");
const { postTokenPas, getPlanComercial, getConducto, getBrand, getModelsByMarkYear, getAccesories, getCotizacionAuto, getMotoBrands, getMotoModels, getCotizacionMoto } = require("../controllers/libra.controllers");
const {tokenValidation} = require("../lib/validateToken") 
const router = express.Router();



router
    .post("/token",postTokenPas)
    .post("/getPlanComercial",getPlanComercial)
    .post("/getConducto",getConducto)
    .post("/getBrand",getBrand)
    .post("/getModelsByMarkYear",getModelsByMarkYear)
    .post("/getCotizacion",getCotizacionAuto)
    .post("/getAccesories",getAccesories)
    .post("/getMotoBrands",getMotoBrands)
    .post("/getMotoModels",getMotoModels)
    .post("/getCotizationMoto",getCotizacionMoto)
    
module.exports = router