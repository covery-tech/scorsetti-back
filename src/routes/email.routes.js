const express = require('express');
const{sendEmail} = require('../controllers/mail.controllers');
const router = express.Router();


router.post('/sendEmail', (req, res) => {
    sendEmail(req.body)
      .then((response) => res.send(response.message))
      .catch((error) => res.status(500).send(error.message));
  });

module.exports = router;