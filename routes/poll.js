"use strict";

const express = require('express');
const router = express.Router();
const Poll = require('../controller/pollController');
const authJwt = require('../middlewares/authJwt');

// Make poll
router.post('/make', [authJwt.verifyToken], Poll.make);

// Get all poll
router.get('/get', [authJwt.verifyToken], Poll.get);

// Edit poll
router.put('/edit', [authJwt.verifyToken], Poll.edit);

// get poll by id
router.get('/get/:id', [authJwt.verifyToken], Poll.gePollById);

// Delete poll by id
router.delete('/delete/:id', [authJwt.verifyToken], Poll.delete);

// Answer poll
router.post('/answer', [authJwt.verifyToken], Poll.answerPoll);

// get answers poll
router.get('/count/:id', [authJwt.verifyToken], Poll.countAnswer);

module.exports = router;
