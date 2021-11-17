"use strict";

const assert = require('assert');
const request = require('supertest');
const app = require('../app');
const jwt = require("jsonwebtoken");
const db = require("../config/db.config");
const config = require("../config/auth.config");
// Needed entry for this unit test.
// INSERT INTO AUser (rol, name, username, password, ActiveDirectoryGUID) VALUES ('Admin','Unit tester','username123','password123','testOk');

describe('Unit testing the /feedback/ route', function () {

    it('test Send feedback', function () {
        const roomId = 2;
        const userId = 1;
        const feedbackScore = 5;
        const feedbackContent = "Goed";

        const token = jwt.sign({
                id: 1,
                name: "UnitTester",
                role: "Admin"
            },
            config.secret,
            {expiresIn: 86400} // 24 hours
        );

        return request(app)
            .post('/feedback/send')
            .set('x-access-token', token)
            .send({
                "roomId": roomId,
                "userId": userId,
                "feedbackContent": feedbackContent,
                "feedbackScore": feedbackScore
            })
            .then(function (res) {
                assert.strictEqual(res.statusCode, 200);
                db.query("SELECT * FROM roomlogin WHERE userId=? AND roomId =?;", [userId, roomId, feedbackContent, feedbackScore], function (error, results) {
                    console.log(results);
                    assert.ok(results);
                });
            });
    });

    it('test get feedback', function () {
        const roomId = 1;
        const token = jwt.sign({
                id: 1,
                name: "UnitTester",
                role: "Spreker"
            },
            config.secret,
            {expiresIn: 86400} // 24 hours
        );

        return request(app)
            .post('/feedback/get')
            .set('x-access-token', token)
            .send({
                "roomId": roomId
            })
            .then(function (res) {
                assert.strictEqual(res.statusCode, 200);
                db.query("SELECT * FROM roomLogin WHERE roomId=?;", [roomId], function (error, results) {
                    assert.ok(results);
                });
            });
    });

});


