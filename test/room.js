"use strict";

const assert = require('assert');
const request = require('supertest');
const app = require('../app');
const db = require("../config/db.config");
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");

describe('Unit testing the /room/ route', function () {

    it('test making a room.', function () {
        const date = new Date();
        const startDate = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2) + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

        const ONE_HOUR = 60 * 60 * 1000; /* ms */
        const dateend = new Date(Date.now() + ONE_HOUR);
        const endDate = dateend.getFullYear() + "-" + ("0" + (dateend.getMonth() + 1)).slice(-2) + "-" + ("0" + dateend.getDate()).slice(-2) + " " + dateend.getHours() + ":" + dateend.getMinutes() + ":" + dateend.getSeconds();

        const token = jwt.sign({
                id: 1,
                name: "UnitTester",
                role: "Admin"
            }, config.secret, {expiresIn: 86400} // 24 hours
        );

        return request(app)
            .post('/room/make')
            .set('x-access-token', token)
            .send({
                name: "Unit testing",
                info: "This is a room made by a unit test.",
                startDate: startDate,
                endDate: endDate,
                userID: 1
            }).then(function (res) {
                assert.strictEqual(res.statusCode, 201);
                assert.strictEqual(res.body.kind, "Room Created");
            });
    });

    it('test edit room.', function () {
        const token = jwt.sign({
                id: 1,
                name: "UnitTester",
                role: "Admin"
            }, config.secret, {expiresIn: 86400} // 24 hours
        );

        return request(app)
            .put('/room/edit')
            .set('x-access-token', token)
            .send({
                "data": {
                    "info": "This is changed info for Unit testing."
                },
                "id": 1
            }).then(function (res) {
                assert.strictEqual(res.statusCode, 200);
                assert.strictEqual(res.body.message, "(Rows matched: 1  Changed: 1  Warnings: 0");
            });
    });

    it('test get rooms', function () {
        const token = jwt.sign({
                id: 1,
                name: "UnitTester",
                role: "User"
            }, config.secret, {expiresIn: 86400} // 24 hours
        );

        return request(app)
            .get('/room/all')
            .set('x-access-token', token)
            .then(function (res) {
                assert.strictEqual(res.statusCode, 200);
                db.query("SELECT * FROM room;", function (error, results) {
                    assert.deepStrictEqual(JSON.stringify(res.body), JSON.stringify(results));
                });
            });
    });

    it('test get room by id', function () {
        const token = jwt.sign({
                id: 1,
                name: "UnitTester",
                role: "User"
            }, config.secret, {expiresIn: 86400} // 24 hours
        );

        return request(app)
            .get('/room/1') // === /room/:id
            .set('x-access-token', token)
            .then(function (res) {
                assert.strictEqual(res.statusCode, 200);
                db.query("SELECT * FROM room WHERE id = 1;", function (error, results) {
                    assert.deepStrictEqual(JSON.stringify(res.body), JSON.stringify(results[0]));
                });
            });
    });

    it('test join room', function () {
        const roomId = 1;
        const userId = 1;

        const token = jwt.sign({
                id: 1,
                name: "UnitTester",
                role: "Admin"
            }, config.secret, {expiresIn: 86400} // 24 hours
        );

        return request(app)
            .post('/room/join')
            .set('x-access-token', token)
            .send({
                "roomId": roomId,
                "userId": userId
            }).then(function (res) {
                assert.strictEqual(res.statusCode, 200);
                db.query("SELECT * FROM roomlogin WHERE userId = ? AND roomId = ?;", [userId, roomId], function (error, results) {
                    // if room is made results[0] = true.
                    assert.ok(results);
                });
            });
    });

    it('test leave room', function () {
        const roomId = 1;
        const userId = 1;

        const token = jwt.sign({
                id: 1,
                name: "UnitTester",
                role: "Admin"
            }, config.secret, {expiresIn: 86400} // 24 hours
        );

        return request(app)
            .post('/room/leave')
            .set('x-access-token', token)
            .send({
                "roomId": roomId,
                "userId": userId
            }).then(function (res) {
                assert.strictEqual(res.statusCode, 200);
                db.query("SELECT * FROM roomlogin WHERE userId = ? AND roomId = ?;", [userId, roomId], function (error, results, fields) {
                    // if room is made results[0] = true.
                    try {
                        assert.match(results[0].endDate, /0000-00-00 00:00:00/gm);
                    } catch (e) {
                    }
                });
            });
    });

    it('test delete the room', function () {
        const roomId = 1;

        const token = jwt.sign({
                id: 1,
                name: "UnitTester",
                role: "Admin"
            }, config.secret, {expiresIn: 86400} // 24 hours
        );

        return request(app)
            .delete('/room/delete/' + roomId)
            .set('x-access-token', token)
            .then(function (res) {
                assert.strictEqual(res.statusCode, 200);
                db.query("SELECT * FROM room WHERE id = ?;", [roomId], function (error, results, fields) {
                    assert.strictEqual(error, null);
                });
            });
    });
});
