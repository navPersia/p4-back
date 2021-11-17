'use strict';

const express = require('express');
const router = express.Router();
const authJwt = require('../middlewares/authJwt');
const controller = require('../controller/chatController');

router.post('/get', [authJwt.verifyToken], controller.get);
router.post('/send', [authJwt.verifyToken], controller.send);
router.post('/like', [authJwt.verifyToken], controller.like);
router.delete('/unlike', [authJwt.verifyToken], controller.unlike);
router.post('/getLikes', [authJwt.verifyToken], controller.getLikes);

module.exports = router;
