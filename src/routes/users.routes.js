const express = require("express");
const { prueba1 } = require("../controllers/products.controllers");
const {register, postLogin, getUserById, updateTypeUser,getImageLarge, getPasUser, getStatusPas, searchUserByEmail, getPasById, getImage, myPersonalData, updateUserInfo, getClientsOfPas, getAllUsers, getAllRoutes} = require("../controllers/users.controllers")
const {tokenValidation} = require("../lib/validateToken") 
const router = express.Router();



router
    .post("/postUser",register)
    .post("/loginUser",postLogin)
    .get("/getUserById/:idUser",getUserById) 
    .get("/getPasById/:idUser",getPasById)//para renderizar pagina de cada pas
    .put("/updateUser/:type/:idUser",tokenValidation,updateTypeUser)
    .get("/getPasUser/:page",getPasUser)
    .put("/estatusPas/:estatus/:idUser",tokenValidation,getStatusPas)
    .get("/searchUserByEmail/:email",tokenValidation,searchUserByEmail)
    .get("/image",tokenValidation,getImage)
    .get("/imageLg/:userId",getImageLarge)
    .get("/myPersonalData",tokenValidation,myPersonalData)
    .put("/updateUserInfo",tokenValidation,updateUserInfo)
    .get("/getClientsOfPas/:idPas",tokenValidation,getClientsOfPas)
    .get("/getAllUsers/:page",tokenValidation,getAllUsers)
    .get("/pasRoutes/:id", getAllRoutes)
module.exports = router