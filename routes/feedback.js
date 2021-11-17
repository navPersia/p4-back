'use strict';

const express = require('express');
const router = express.Router();
const authJwt = require('../middlewares/authJwt');
const controller = require('../controller/feedbackController');

router.post('/get', [authJwt.verifyToken], controller.get);
router.post('/send', [authJwt.verifyToken], controller.send);

module.exports = router;
