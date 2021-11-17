"use strict";

const db = require("../config/db.config");

const Chat = function Chat(chat) {
    this.username = chat.username;
    this.message = chat.message;
    this.date = chat.date;
    this.role = chat.role;
    this.inRoom = chat.inRoom;
};

Chat.getChat = function (roomID, result) {
    db.query("SELECT messaging.id, messaging.userId, messaging.messaging, messaging.postedAt, messaging.roomId, auser.role, auser.username FROM messaging INNER JOIN auser ON messaging.userId = auser.id WHERE roomId=? ORDER by postedAt;", [roomID], function (err, res, fiel) {
        if (err) {
            console.log("error getting messages: ", err);
            result(err, null);
            return;
        }
        if (res[0]) {
            console.log("got messages");
            result(null, res);
            return;
        }
        console.log(res);
        // not find any messages in room
        result({kind: "not_found"}, null);
    });
};

Chat.sendMessage = function (userId, message, roomId, result) {
    const date = new Date();
    const dateFormated = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2) + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

    db.query("INSERT INTO messaging (userId, messaging, roomId, postedAt) VALUES (? ,? ,? , ?);", [userId, message, roomId, dateFormated], function (err, res) {
        if (err) {
            console.log("error sending the message: ", err);
            result(err, null);
            return;
        }
        console.log("Message sent");
        result(null, res);
    })
};


Chat.getLikeMessages = function (userId, messageId, result) {
    db.query("SELECT * FROM likes;", function (err, res, fiel) {
        if (err) {
            console.log("error getting messages: ", err);
            result(err, null);
            return;
        }
        if (res[0]) {
            console.log("got messages");
            result(null, res);
            return;
        }
        console.log(res);
        // not find any messages in room
        result({kind: "not_found"}, null);
    });
};

Chat.likeMessage = function (userId, messageId, result) {
    // Check if user already liked.
    db.query("INSERT INTO likes (userid, messageid) VALUES (?, ?);", [userId, messageId], function (error, res, fields) {
        if (error) {
            console.log("error sending the message: ", error);
            result(error, null);
            return;
        }
        console.log("Message sent");
        result(null, res);
    });

};

Chat.unlikeMessage = function (userId, messageId, result) {
    // Check if user already liked.
    db.query("DELETE FROM likes WHERE userid=? AND messageid=?;", [userId, messageId], function (err, res, fields) {
        if (err) {
            console.log("error sending the message: ", err);
            result(err, null);
            return;
        }
        console.log("Message sent");
        result(null, res);
    });
};

module.exports = Chat;
