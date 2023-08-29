const express = require("express");
const { UserController } = require("../controllers/users.controllers")
const {tokenValidation} = require("../lib/validateToken"); 
const { validationLogin } = require("../validationErrors/validateUser");
const { validationId } = require("../validationErrors/validateId");
const router = express.Router();



router
    .post("/postUser",UserController.register)
    .post("/loginUser",validationLogin,UserController.postLogin)
    .get("/getUserById/:idUser",validationId,UserController.getUserById) 
    .get("/getPasByRoute/:route",UserController.getPasByRoute)//para renderizar pagina de cada pas
    .get("/getPasById/:id",validationId,UserController.getPasById)
    .put("/updateUser/:type/:idUser",tokenValidation,UserController.updateTypeUser)
    .get("/getPasUser/:page",UserController.getPasUser)
    .put("/estatusPas/:estatus/:idUser",tokenValidation,UserController.getStatusPas)
    .get("/searchUserByEmail/:email",tokenValidation,UserController.searchUserByEmail)
    .get("/image",tokenValidation,UserController.getImage)
    .get("/imageLg/:userId",UserController.getImageLarge)
    .get("/myPersonalData",tokenValidation,UserController.myPersonalData)
    .put("/updateUserInfo",tokenValidation,UserController.updateUserInfo)
    .get("/getClientsOfPas/:idPas",validationId,tokenValidation,UserController.getClientsOfPas)
    .get("/getAllUsers/:page",tokenValidation,UserController.getAllUsers)
    .get("/pasRoutes/:id",validationId, UserController.getAllRoutes)
    .get("/getPasInfo/:idPas",validationId, UserController.getPasInfo)
module.exports = router