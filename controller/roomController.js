"use strict";

const Room = require('../models/room');

exports.make = function (req, res) {
    const jsonArray = req.body;
    const decoded = req.decoded;
    // date format is YYYY-MM-DD HH:MM:SS
    if (decoded.role === "Admin") {
        Room.createRoom(jsonArray, function (err, data) {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: "Could not create Room."
                    });
                } else {
                    res.status(500).send({
                        message: "Error creating Room"
                    });
                }
            } else {
                res.status(201).send(data);
            }
        });
    } else {
        res.status(403).send({
            message: "You are not permitted"
        });
    }
};

exports.join = function (req, res) {
    const jsonArray = req.body;
    const decoded = req.decoded;
    Room.login(jsonArray.roomId, jsonArray.userId, function (err, data) {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: "Could not join Room."
                });
            } else {
                res.status(500).send({
                    message: "Error joining Room"
                });
            }
        } else {
            res.status(200).send(data);
        }
    });
};

exports.leave = function (req, res) {
    const jsonArray = req.body;
    const decoded = req.decoded;
    Room.logout(jsonArray.roomId, jsonArray.userId, function (err, data) {
        if (err) {
            res.status(500).send({
                message: "Error leaving Room"
            });
        } else {
            res.status(200).send("Left Room.");
        }
    });
};

exports.delete = function (req, res) {
    const id = parseInt(req.params.id);
    const decoded = req.decoded;
    if (decoded.role === "Admin") {
        Room.deleteById(id, function (err, data) {
            if (err) {
                res.status(500).send({
                    message: "Error deleting room: " + err
                });
            } else {
                res.status(200).send("room is deleted : " + id);
            }
        });
    } else {
        res.status(403).send({
            message: "You are not permitted"
        });
    }
};

exports.edit = function (req, res) {
    const jsonArray = req.body;
    const decoded = req.decoded;
    if (decoded.role === "Admin") {
        Room.edit(jsonArray.data, jsonArray.id, function (err, data) {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: "Could not edit room"
                    });
                } else {
                    res.status(500).send({
                        message: "Error editing Room"
                    });
                }
            } else {
                res.status(200).send(data);
            }
        });
    } else {
        res.status(403).send({
            message: "You are not permitted"
        });
    }
};

exports.getall = function (req, res) {
    Room.getall(function (err, data) {
        if (err) {
            res.status(500).send({
                message: "Error retrieving Room"
            });
        } else {
            res.status(200).send(data);
        }
    });
};

exports.getbyid = function (req, res) {
    const id = req.params.id;
    Room.getbyid(id, function (err, data) {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: "Could not retrieve room by id"
                });
            } else {
                res.status(500).send({
                    message: "Error retrieving room by id"
                });
            }
        } else {
            res.status(200).send(data);
        }
    });
};

exports.getbydate = function (req, res) {
    const jsonArray = req.body;
    Room.getbydate(jsonArray.id, jsonArray.date, function (err, data) {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: "Could not retrieve room by id and date"
                });
            } else {
                res.status(500).send({
                    message: "Error retrieving room by id and date"
                });
            }
        } else {
            res.status(200).send(data);
        }
    });
};
