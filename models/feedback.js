"use strict";

const db = require("../config/db.config");

const Feedback = function Feedback(feedback) {
    this.feedbackContent = feedback.feedbackContent;
    this.feedbackScore = feedback.feedbackScore;
    this.endDate = feedback.endDate;
    this.startDate = feedback.startDate;
};

Feedback.getFeedback = function (roomID, result) {
    db.query("SELECT * FROM roomlogin WHERE roomId=?;", [roomID], function (err, res) {
        if (err) {
            console.log("error getting feedback: ", err);
            result(err, null);
            return;
        }
        if (res[0]) {
            console.log("got feedback");
            result(null, res);
            return;
        }
        console.log(res);
        // not find any messages in room
        result({kind: "not_found"}, null);
    });
};

Feedback.sendFeedback = function (userId, roomId, feedbackContent, feedbackScore, result) {
    db.query("UPDATE roomlogin SET feedbackContent =?, feedbackScore =? WHERE userId=? AND roomId=?;", [feedbackContent, feedbackScore, userId, roomId], function (err, res) {
        if (err) {
            console.log("error sending the feedback: ", err);
            result(err, null);
            return;
        }
        console.log("feedback sent");
        result(null, res);
    });
};

module.exports = Feedback;
