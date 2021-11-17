"use strict";

const db = require("../config/db.config");

const Poll = function Poll(poll) {
    this.id = querry.insertId;
    this.type = type;
    this.active = true;
    this.question = question;
    this.options = options;
    this.roomId = roomID;
};

//create poll
Poll.createPoll = function (data, result) {
    db.query("INSERT INTO poll (type, active, question, options, roomID) VALUES (?, ?, ?, ?, ?);", [data.type, data.active, data.question, data.options, data.roomID], function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        console.log("poll created");
        result(null, res);
    });
};

//delete poll
Poll.deletepoll = function (id, result) {
    db.query("DELETE FROM voteuser WHERE pollId = ?;", [id], function (err) {
        if (err) {
            throw err;
        }
    });
    db.query("DELETE FROM poll WHERE id = ?;", [id], function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        if (res.affectedRows === 1) {
            console.log("poll deleted: ", res);
            result(null, res);
            return;
        }
        // not found Customer with the id
        result({kind: "not_found"}, null);
    });
};

//get all polls
Poll.findall = function (result) {
    db.query("SELECT * FROM poll ;", function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        if (res.length) {
            console.log("got all polls ", res);
            result(null, res);
            return;
        }
        // not found Customer with the id
        result({kind: "not_found"}, null);
    });
};

//get one poll to edit
Poll.findById = function (id, result) {
    db.query("SELECT * FROM poll WHERE id = ?;", [id], function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        console.log("found poll: ", res[0]);
        result(null, res[0]);
    });
};

//edit poll
Poll.updatePoll = function (data, id, result) {
    db.query("UPDATE poll SET " + db.escape(data) + " WHERE id = " + db.escape(id) + ";", function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        if (res.affectedRows !== 0) {
            console.log("poll edited");
            result(null, res);
            return;
        }
        // not found Customer with the id
        result({kind: "not_found"}, null);
    });
};

Poll.answer = function (data, result) {
    db.query("INSERT INTO voteuser (userId, pollId, answer) VALUES(?, ?, ?);", [data.userId, data.pollId, data.answer], function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        console.log("answered to a poll");
        result(null, res);
    });
};

Poll.countAnswer = function (id, result) {
    db.query("SELECT answer FROM voteuser WHERE pollId = ?;", [id], function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        if (res.length) {
            console.log("answers counted");
            result(null, res);
            return;
        }
        // not found Customer with the id
        result({kind: "not_found"}, null);
    });
};

module.exports = Poll;
