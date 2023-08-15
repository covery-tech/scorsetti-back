const express = require("express")
const {getProductCard, createInterTableProductUser, updateStatusProduct, getPassProductsEneable, getPassProductsAll, getMyProductsSale, numberOfOrders, numberOfClients, amountOfOrders, emitNotificationPas, getNotificationAdmin, deleteNotificationAdmin, emitNotificationAdmin, getCountNotis, getNotificationPas, getCountNotisPas, deleteNotificationPas, getAllOrdersByPas, postOrdersBackoffice, dairySales, getAllOrdersByUser, emitNotificationClient, getNotificationClient} = require("../controllers/products.controllers");
const { tokenValidation } = require("../lib/validateToken");

const router = express.Router();


router
    .get("/getProductCard",getProductCard)
    .post("/postProductCard",createInterTableProductUser)
    .get("/getProductsPas/:idUser",getPassProductsEneable)
    .get("/getProductsPasAll/:idUser",getPassProductsAll)
    .put("/statusProduct/:status/:idPas/:column",tokenValidation,updateStatusProduct)
    .get("/getMyProductsSale/:idPas/:page",getMyProductsSale)
    .get("/numberOfOrders",tokenValidation,numberOfOrders)
    .get("/numberOfClients",tokenValidation,numberOfClients)
    .get("/amountOfOrders",tokenValidation,amountOfOrders)
    .get("/dairySales/:fecha",tokenValidation,dairySales)
    .post("/emitNotificationPas",emitNotificationPas)
    .put("/deleteNotificationAdmin/:idNoti",deleteNotificationAdmin)
    .put("/deleteNotificationPas/:idNoti",deleteNotificationPas)
    .get("/getNotificationAdmin/:page",getNotificationAdmin)
    .get("/getNotificationClient/:page",tokenValidation,getNotificationClient)
    .get("/getNotificationPas/:page",tokenValidation,getNotificationPas)
    .post("/emitNotificationAdmin",emitNotificationAdmin)
    .get("/getCountNotis",getCountNotis)
    .get("/getCountNotisPas",tokenValidation,getCountNotisPas)
    .get("/getAllOrdersByPas/:idPas?",getAllOrdersByPas)
    .get("/getAllOrdersByUser/:page",tokenValidation,getAllOrdersByUser)
    .post("/postOrdersBack", postOrdersBackoffice)
module.exports = router