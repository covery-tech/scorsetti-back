const express = require("express")
const { productController } = require("../controllers/products.controllers");
const { tokenValidation } = require("../lib/validateToken");
const router = express.Router();


router
    .get("/getProductsPas/:idUser",productController.getPassProductsEneable)
    .get("/getProductsPasAll/:idUser",productController.getPassProductsAll)
    .put("/statusProduct/:status/:idPas/:column",tokenValidation,productController.updateStatusProduct)
    .get("/getMyProductsSale/:idPas/:page",productController.getMyProductsSale)
    .get("/numberOfOrders",tokenValidation,productController.numberOfOrders)
    .get("/numberOfClients",tokenValidation,productController.numberOfClients)
    .get("/amountOfOrders",tokenValidation,productController.amountOfOrders)
    .get("/dairySales/:fecha?",tokenValidation,productController.dairySales)
    .post("/emitNotificationPas",productController.emitNotificationPas)
    .put("/deleteNotificationAdmin/:idNoti",productController.deleteNotificationAdmin)
    .put("/deleteNotificationPas/:idNoti",productController.deleteNotificationPas)
    .get("/getNotificationAdmin/:page",productController.getNotificationAdmin)
    .get("/getNotificationClient/:page",tokenValidation,productController.getNotificationClient)
    .get("/getNotificationPas/:page",tokenValidation,productController.getNotificationPas)
    .post("/emitNotificationAdmin",productController.emitNotificationAdmin)
    .get("/getCountNotis",productController.getCountNotis)
    .get("/getCountNotisPas",tokenValidation,productController.getCountNotisPas)
    .get("/getAllOrdersByPas/:idPas?",productController.getAllOrdersByPas)
    .get("/getAllOrdersByUser/:page",tokenValidation,productController.getAllOrdersByUser)
    .post("/postOrdersBack/:pas_id", productController.postOrdersBackoffice)
    .put("/updateCotiStatus/:id/:cotizated", productController.updateCotizatedProduct)
module.exports = router