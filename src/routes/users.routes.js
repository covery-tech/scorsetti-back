const express = require("express");
const { UserController } = require("../controllers/users.controllers")
const {tokenValidation} = require("../lib/validateToken") 
const router = express.Router();



router
    .post("/postUser",UserController.register)
    .post("/loginUser",UserController.postLogin)
    .get("/getUserById/:idUser",UserController.getUserById) 
    .get("/getPasByRoute/:route",UserController.getPasByRoute)//para renderizar pagina de cada pas
    .get("/getPasById/:id",UserController.getPasById)
    .put("/updateUser/:type/:idUser",tokenValidation,UserController.updateTypeUser)
    .get("/getPasUser/:page",UserController.getPasUser)
    .put("/estatusPas/:estatus/:idUser",tokenValidation,UserController.getStatusPas)
    .get("/searchUserByEmail/:email",tokenValidation,UserController.searchUserByEmail)
    .get("/image",tokenValidation,UserController.getImage)
    .get("/imageLg/:userId",UserController.getImageLarge)
    .get("/myPersonalData",tokenValidation,UserController.myPersonalData)
    .put("/updateUserInfo",tokenValidation,UserController.updateUserInfo)
    .get("/getClientsOfPas/:idPas",tokenValidation,UserController.getClientsOfPas)
    .get("/getAllUsers/:page",tokenValidation,UserController.getAllUsers)
    .get("/pasRoutes/:id", UserController.getAllRoutes)
    .get("/getPasInfo/:idPas", UserController.getPasInfo)
module.exports = router