const express = require("express")
const cors = require("cors")
const users = require("./routes/users.routes")
const forms = require("./routes/forms.routes")
const mp = require("./routes/mercadoPago.routes")
const products = require("./routes/products.routes")
const images = require("./routes/image.routes")
const libra = require("./routes/libra.routes")
const mail = require("./routes/email.routes")
const upload = require("./routes/upload.routes")
const path = require('path')
require("dotenv").config()
const PORT = process.env.PORT || 3001
const app = express()
app.use(express.json())
//use routes


app.use(cors());
app.use(express.static(path.join(__dirname,"optimize")))

app.use("/mp",mp)
app.use("/user",users)
app.use("/form",forms)
app.use("/product",products)
app.use("/image",images)
app.use("/libra",libra)
app.use("/mail",mail)
app.use("/upload",upload)

//server
app.listen(PORT,()=>{
    console.log(`server on port ${PORT}`)
});