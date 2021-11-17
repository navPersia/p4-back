const express = require('express');
const router = express.Router();
const authJwt = require('../middlewares/authJwt');
const controller = require('../controller/roomController');

//Make room
router.post('/make', [authJwt.verifyToken], controller.make);

//Edit room
router.put('/edit', [authJwt.verifyToken], controller.edit);

//Join room
router.post('/join', [authJwt.verifyToken], controller.join);

//Leave room
router.post('/leave', [authJwt.verifyToken], controller.leave);

//Delete room
router.delete('/delete/:id', [authJwt.verifyToken], controller.delete);

// Get all rooms
router.get('/all', [authJwt.verifyToken], controller.getall);

// Get room by id
router.get('/:id', [authJwt.verifyToken], controller.getbyid);

// Get by date
router.post('/getdate', [authJwt.verifyToken], controller.getbydate);

module.exports = router;
