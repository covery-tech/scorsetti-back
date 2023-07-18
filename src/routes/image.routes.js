const { tokenValidation } = require("../lib/validateToken");
const express = require("express");
const { img } = require("../controllers/image.controllers");
const router = express.Router();


const multer  = require('multer')


// Definir el almacenamiento para los archivos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '../api/src/uploads')
    },
    filename: function (req, file, cb) {
        const ext = file.originalname.split('.').pop()
      cb(null,`${Date.now()}.${ext}`)
    }
  });
  
  // Crear un middleware de Multer
  const upload = multer({ storage: storage });

router.post("/image",upload.single('image'),tokenValidation,img)

module.exports = router


