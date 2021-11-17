"use strict";

const Chat = require('../models/chat');
const db = require("../config/db.config");

exports.get = function (req, res) {
    const jsonArray = req.body;

    Chat.getChat(jsonArray.roomId, function (err, data) {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: "Could not get messages"
                });
            } else {
                res.status(500).send({
                    message: "Error getting messages"
                });
            }
        } else {
            res.status(200).send(data);
        }
    })
};


exports.send = function (req, res) {
    const jsonArray = req.body;
    Chat.sendMessage(jsonArray.userId, jsonArray.message, jsonArray.roomId, function (err, data) {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: "Could not send the message"
                });
            } else {
                res.status(500).send({
                    message: "Error sending the message"
                });
            }
        } else {
            res.status(200).send(data);
        }
    });
};


exports.getLikes = function (req, res) {
    const jsonArray = req.body;

    Chat.getLikeMessages(jsonArray.userId, jsonArray.messageId, function (err, data) {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: "Error getting the messagelikes"
                });
            } else {
                res.status(500).send({
                    message: "Error getting the messagelikes"
                });
            }
        }
        res.status(200).send(data);
    });
};


exports.like = function (req, res) {
    const jsonArray = req.body;

    Chat.likeMessage(jsonArray.userId, jsonArray.messageId, function (err, data) {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: "Error liking the message"
                });
            } else {
                res.status(500).send({
                    message: "Error liking the message"
                });
            }
        }
        res.status(200).send(data);
    });
};

exports.unlike = function (req, res) {
    const jsonArray = req.body;

    Chat.unlikeMessage(jsonArray.userId, jsonArray.messageId, function (err, data) {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: "Error liking the message"
                });
            } else {
                res.status(500).send({
                    message: "Error liking the message"
                });
            }
        }
        res.status(200).send(data);
    });
};
