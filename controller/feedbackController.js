"use strict";

const Feedback = require('../models/feedback');

exports.get = function (req, res) {
    const jsonArray = req.body;
    const decoded = req.decoded;
    if (decoded.role === "Spreker" || decoded.role === "Admin" || decoded.role === "Moderator") {
        Feedback.getFeedback(jsonArray.roomId, function (err, data) {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: "Could not get feedback"
                    });
                } else {
                    res.status(500).send({
                        message: "Error getting feedback"
                    });
                }
            } else {
                res.status(200).send(data);
            }
        })
    } else {
        res.status(403).send({
            message: "You are not permitted"
        });
    }
};


exports.send = function (req, res) {
    const jsonArray = req.body;
    Feedback.sendFeedback(jsonArray.userId, jsonArray.roomId, jsonArray.feedbackContent, jsonArray.feedbackScore, function (err, data) {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: "Could not send the feedback"
                });
            } else {
                res.status(500).send({
                    message: "Error sending the feedback"
                });
            }
        } else {
            res.status(200).send(data);
        }
    });
};



