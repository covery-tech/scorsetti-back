const express = require("express")
const {getProductCard, createInterTableProductUser, updateStatusProduct, getPassProductsEneable, getPassProductsAll, getMyProductsSale, numberOfOrders, numberOfClients, amountOfOrders, emitNotificationPas, getNotificationAdmin, deleteNotificationAdmin, emitNotificationAdmin, getCountNotis, getNotificationPas, getCountNotisPas, deleteNotificationPas, postCoti, postCotiJson, getAllOrders, getAllOrdersByPas} = require("../controllers/products.controllers");
const { tokenValidation } = require("../lib/validateToken");

const router = express.Router();


router
    .get("/getProductCard",getProductCard)
    .post("/postProductCard",createInterTableProductUser)
    .get("/getProductsPas/:idUser",getPassProductsEneable)
    .get("/getProductsPasAll/:idUser",getPassProductsAll)
    .put("/statusProduct/:status/:idPas/:column",tokenValidation,updateStatusProduct)
    .get("/getMyProductsSale/:idPas/:page",getMyProductsSale)
    .get("/numberOfOrders/:idPas",numberOfOrders)
    .get("/numberOfClients/:idPas",numberOfClients)
    .get("/amountOfOrders/:idPas",amountOfOrders)
    .post("/emitNotificationPas",emitNotificationPas)
    .put("/deleteNotificationAdmin/:idNoti",deleteNotificationAdmin)
    .put("/deleteNotificationPas/:idNoti",deleteNotificationPas)
    .get("/getNotificationAdmin/:page",getNotificationAdmin)
    .get("/getNotificationPas/:page",tokenValidation,getNotificationPas)
    .post("/emitNotificationAdmin",emitNotificationAdmin)
    .get("/getCountNotis",getCountNotis)
    .get("/getCountNotisPas",tokenValidation,getCountNotisPas)
    .post("/postCotization",postCoti)
    .post("/postCotizationJson",postCotiJson)
    .get("/getAllOrdersByPas/:idPas",getAllOrdersByPas)
    .get("/getAllOrders",getAllOrders)
    
module.exports = router