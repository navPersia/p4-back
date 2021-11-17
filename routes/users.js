const express = require('express');
const authJwt = require("../middlewares/authJwt");
const router = express.Router();
const user = require('../controller/userController');

// Authenticate
router.post('/login', user.login);

// Get user by Id
router.get("/:id", [authJwt.verifyToken], user.id);

// Delete user by id
router.delete("/:id", [authJwt.verifyToken], user.deleteById);

// Create new user
router.post("/", [authJwt.verifyToken], user.createUser);

// Get all users
router.get('/', [authJwt.verifyToken], user.allUsers);

// Modify a user with id
router.post("/:id", [authJwt.verifyToken], user.editUser);


module.exports = router;
