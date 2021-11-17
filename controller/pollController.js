"use strict";

const Poll = require('../models/poll');
const db = require("../config/db.config");

exports.make = function (req, res) {
    const poll = req.body;
    const decoded = req.decoded;
    if (decoded.role === "Spreker" || decoded.role === "Admin") {
        Poll.createPoll(poll, function (err, data) {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: "Could not create Poll."
                    });
                } else {
                    res.status(500).send({
                        message: "Error creating Poll"
                    });
                }
            } else {
                res.status(201).send();
            }
        });
    } else {
        res.status(403).send({
            message: "You are not permitted"
        });
    }
};

exports.get = function (req, res) {
    const decoded = req.decoded;
    if (decoded.role === "Spreker" || decoded.role === "Admin") {
        Poll.findall(function (err, data) {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: "Could not get all polls."
                    });
                } else {
                    res.status(500).send({
                        message: "Error getting Polls"
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

exports.gePollById = function (req, res) {
    const id = req.params.id;
    const decoded = req.decoded;
    if (decoded.role === "Spreker" || decoded.role === "Admin") {
        Poll.findById(id, function (err, data) {
            if (err) {
                res.status(500).send({
                    message: "Error getting poll"
                });
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

exports.delete = function (req, res) {
    const id = req.params.id;
    const decoded = req.decoded;
    if (decoded.role === "Spreker" || decoded.role === "Admin") {
        Poll.deletepoll(id, function (err, data) {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: "Could not delete Poll."
                    });
                } else {
                    res.status(500).send({
                        message: "Error deleting Poll"
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

exports.edit = function (req, res) {
    const newpoll = req.body;
    const decoded = req.decoded;
    if (decoded.role === "Spreker" || decoded.role === "Admin") {
        Poll.updatePoll(newpoll.data, newpoll.id, function (err, data) {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: "Could not edit Poll."
                    });
                } else {
                    res.status(500).send({
                        message: "Error edit Poll"
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

exports.answerPoll = function (req, res) {
    const answer = req.body;
    Poll.answer(answer, function (err, data) {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: "Could not get answers."
                });
            } else {
                res.status(500).send({
                    message: "Error getting answers"
                });
            }
        } else {
            res.status(201).send(data);
        }
    });
};

exports.countAnswer = function (req, res) {
    const pollid = req.params.id;
    const decoded = req.decoded;
    if (decoded.role === "Spreker" || decoded.role === "Admin") {
        Poll.countAnswer(pollid, function (err, data) {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: "Could not delete Poll."
                    });
                } else {
                    res.status(500).send({
                        message: "Error deleting Poll"
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
