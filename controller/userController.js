"use strict";

const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");
const User = require('../models/user');

// Authenticate
exports.login = function (req, res) {
    User.findByUsername(req.body.username, function (err, data) {
        if (err) {
            if (err.kind === "not_found") {
                return res.status(200).send({
                    AccessToken: null,
                    message: "user Not Found code 404"
                });
            } else {
                return res.status(200).send({
                    AccessToken: null,
                    message: "user not found code 500"
                });
            }
        } else {
            const passwordIsValid = req.body.password === data.password;
            if (!passwordIsValid) {
                return res.status(200).send({
                    AccessToken: null,
                    message: "Invalid Password!"
                });
            }
            const token = jwt.sign({
                    id: data.id,
                    name: data.username,
                    role: data.role
                }, config.secret, {expiresIn: 86400} // 24 hours
            );
            res.status(200).send({
                AccessToken: token,
                message: "Valid login"
            });
        }
    });
};

// Get user by Id
exports.id = function (req, res) {
    const id = req.params.id;

    User.findById(id, function (err, data) {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: "Not found User with id " + id + "."
                });
            } else {
                res.status(500).send({
                    message: "Error retrieving User with username " + id
                });
            }
        } else {
            const decoded = req.decoded;
            if (decoded.role === "Admin") {
                res.status(200).send({
                    id: data.id,
                    name: data.name,
                    role: data.rol,
                    username: data.username,
                    password: data.password
                });
            } else {
                res.status(200).send({
                    id: data.id,
                    name: data.name,
                    role: data.rol,
                    username: data.username,
                    password: null
                });
            }
        }
    });
};

exports.deleteById = function (req, res) {
    const id = req.params.id;

    const decoded = req.decoded;
    if (decoded.role === "Admin") {
        User.deleteById(id, function (err, data) {
            res.status(200).send({
                message: "deleted"
            });
        });
    } else {
        res.status(403).send({
            message: "You are not permitted"
        });
    }
};

exports.createUser = function (req, res) {
    const user = req.body;
    const decoded = req.decoded;
    if (decoded.role === "Admin") {
        User.createUser(user, function (err, data) {
            res.status(200).send({
                message: "success"
            });
        });
    } else {
        res.status(403).send({
            message: "You are not permitted"
        });
    }
};

exports.allUsers = function (req, res) {
    const decoded = req.decoded;
    if (decoded.role === "Admin") {
        User.getAllUsers(function (err, data) {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: "Not found Users."
                    });
                } else {
                    res.status(500).send({
                        message: "Error retrieving Users"
                    });
                }
            } else {
                res.status(200).send({
                    data: data
                });
            }
        })
    } else {
        res.status(403).send({
            message: "You are not permitted"
        });
    }
};

exports.editUser = function (req, res) {
    const newUser = req.body;
    const decoded = req.decoded;
    const id = req.params.id;

    if (decoded.role === "Admin") {
        User.findById(id, function (err, data) {
            if (!newUser.name) {
                newUser.name = data.name;
            }
            if (!newUser.role) {
                newUser.role = data.role;
            }
            if (!newUser.username) {
                newUser.username = data.username;
            }
            if (!newUser.password) {
                newUser.password = data.password;
            }

            User.updateUser(id, newUser, function (err, data) {
                res.status(200).send({
                    message: "done!"
                });
            });
        });
    } else {
        res.status(403).send({
            message: "You are not permitted"
        });
    }
};
