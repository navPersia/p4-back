"use strict";

const assert = require('assert');
const request = require('supertest');
const app = require('../app');
const jwt = require("jsonwebtoken");
const db = require("../config/db.config");
const config = require("../config/auth.config");
// Needed entry for this unit test.
// INSERT INTO AUser (rol, name, username, password, ActiveDirectoryGUID) VALUES ('Admin','Unit tester','username123','password123','testOk');

describe('Unit testing the /chat/ route', function () {

    it('test Send chat', function () {
        const roomId = 1;
        const userId = 1;
        const message = "Hallo";
        const date = new Date();
        const posted = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2) + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

        const token = jwt.sign({
                id: 1,
                name: "UnitTester",
                role: "Admin"
            },
            config.secret,
            {expiresIn: 86400} // 24 hours
        );

        return request(app)
            .post('/chat/send')
            .set('x-access-token', token)
            .send({
                "roomId": roomId,
                "userId": userId,
                "message": message,
                "date": posted
            })
            .then(function (res) {
                assert.strictEqual(res.statusCode, 200);
                db.query("SELECT * FROM messaging WHERE userId=? and messaging =? ORDER by postedAt;", [userId, message], function (error, results, fiel) {
                    assert.ok(results);
                });
            });
    });

    it('test get chat', function () {
        const roomId = 1;
        const userId = 1;
        const message = "test";
        const token = jwt.sign({
                id: 1,
                name: "UnitTester",
                role: "Admin"
            },
            config.secret,
            {expiresIn: 86400} // 24 hours
        );

        return request(app)
            .post('/chat/get')
            .set('x-access-token', token)
            .send({
                "roomId": roomId,
                "userId": userId,
                "message": message
            })
            .then(function (res) {
                assert.strictEqual(res.statusCode, 200);
                db.query("SELECT * FROM messaging WHERE roomId=? ORDER by postedAt;", [roomId], function (error, results) {
                    assert.ok(results);
                });
            });
    });

    it('test like message', function () {
        const userId = 1;
        const messageId = 1;

        const token = jwt.sign({
                id: 1,
                name: "UnitTester",
                role: "Admin"
            },
            config.secret,
            {expiresIn: 86400} // 24 hours
        );

        return request(app)
            .post('/chat/like')
            .set('x-access-token', token)
            .send({
                "userId": userId,
                "messageId": messageId
            })
            .then(function (res) {
                assert.strictEqual(res.statusCode, 200);
                db.query("SELECT * FROM likes where userId=? and messageId=?", [userId, messageId], function (error, results, fiel) {
                    assert.ok(results[0]);
                });
            });
    });

    it('test get like message', function () {
        const userId = 1;
        const messageId = 2;

        const token = jwt.sign({
                id: 1,
                name: "UnitTester",
                role: "Admin"
            },
            config.secret,
            {expiresIn: 86400} // 24 hours
        );

        return request(app)
            .post('/chat/getLikes')
            .set('x-access-token', token)
            .send({
                "userId": userId,
                "messageId": messageId
            })
            .then(function (res) {
                assert.strictEqual(res.statusCode, 200);
                db.query("SELECT * FROM likes where userId=? and messageId=?;", [userId, messageId], function (error, results, fiel) {
                    assert.ok(results);
                });
            });
    });

    it('test delete message', function () {
        const userId = 1;

        const messageId = 2;

        const token = jwt.sign({
                id: 1,
                name: "UnitTester",
                role: "Admin"
            },
            config.secret,
            {expiresIn: 86400} // 24 hours
        );

        return request(app)
            .delete('/chat/unlike')
            .set('x-access-token', token)
            .send({
                "userId": userId,
                "messageId": messageId

            })
            .then(function (res) {
                db.query("SELECT * FROM likes WHERE Userid = ? and messageId =?;", [userId, messageId], function (error, results, fields) {
                    assert.ok(results);
                });
            });
    })
});


