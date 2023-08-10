const express = require("express");
const { sendEmail, sendEmailCoti, sendEmailCotiClient } = require("../controllers/mail.controllers");
const router = express.Router();

router
    .post("/sendEmail", (req, res) => {
        sendEmail(req.body)
            .then((response) => res.send(response.message))
            .catch((error) => res.status(500).send(error.message));
    })
    .post("/sendEmailCoti", (req, res) => {
        sendEmailCoti(req.body)
            .then((response) => res.send(response.message))
            .catch((error) => res.status(500).send(error.message));
    })
    .post("/sendEmailCotiClient", (req, res) => {
      sendEmailCotiClient(req.body)
          .then((response) => res.send(response.message))
          .catch((error) => res.status(500).send(error.message));
  })

module.exports = router;
