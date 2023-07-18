const Router = require("express")
const { createPlan, notificationOrder } = require("../controllers/mercadoPago.controllers")
const router = Router()

router.post("/create-plan", createPlan)
router.post("/notification", notificationOrder)

module.exports =router