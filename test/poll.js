"use strict";

const assert = require('assert');
const request = require('supertest');
const app = require('../app');
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");

describe('Unit testing the /room/ route', function () {

    it('test making a poll.', function () {
        const token = jwt.sign({
                id: 1,
                name: "UnitTester",
                role: "Speaker"
            }, config.secret, {expiresIn: 86400} // 24 hours
        );

        return request(app)
            .post('/poll/make')
            .set('x-access-token', token)
            .send({
                type: "Unit test",
                active: true,
                question: "Does the unit test work ?",
                options: "Yes|No|Oeps",
                roomID: 1
            }).then(function (res) {
                assert.strictEqual(res.statusCode, 201);
            });
    });

    it('test get all polls', function () {
        const token = jwt.sign({
                id: 1,
                name: "UnitTester",
                role: "Speaker"
            }, config.secret, {expiresIn: 86400} // 24 hours
        );

        return request(app)
            .get('/poll/get')
            .set('x-access-token', token)
            .then(function (res) {
                assert.strictEqual(res.statusCode, 201);
                assert.strictEqual(res.body[0].question, "Does the unit test work ?");
            });

    });

    it('test edit poll', function () {
        const token = jwt.sign({
                id: 1,
                name: "UnitTester",
                role: "Speaker"
            }, config.secret, {expiresIn: 86400} // 24 hours
        );

        return request(app)
            .put('/poll/edit')
            .set('x-access-token', token)
            .send({
                "data": {
                    "question": "This is changed question for Unit testing."
                },
                "id": 1
            })
            .then(function (res) {
                assert.strictEqual(res.statusCode, 201);
                assert.strictEqual(res.body.message, "(Rows matched: 1  Changed: 1  Warnings: 0");
            });
    });

    it('test get poll by id', function () {
        const token = jwt.sign({
                id: 1,
                name: "UnitTester",
                role: "Speaker"
            }, config.secret, {expiresIn: 86400} // 24 hours
        );

        return request(app)
            .get('/poll/get/1')
            .set('x-access-token', token)
            .then(function (res) {
                assert.strictEqual(res.statusCode, 201);
                assert.deepStrictEqual(res.body, {
                    active: {
                        "data": [
                            1
                        ],
                        "type": "Buffer"
                    },
                    id: 1,
                    options: "Yes|No|Oeps",
                    question: "This is changed question for Unit testing.",
                    roomId: 1,
                    type: "Unit test"
                });
            });
    });

    it('test answer poll.', function () {
        const token = jwt.sign({
                id: 1,
                name: "UnitTester",
                role: "User"
            }, config.secret, {expiresIn: 86400} // 24 hours
        );

        return request(app)
            .post('/poll/answer')
            .set('x-access-token', token)
            .send({
                userId: 1,
                pollId: 1,
                answer: "Yes"
            })
            .then(function (res) {
                assert.strictEqual(res.statusCode, 201);
            });
    });

    it('test answer count.', function () {
        const token = jwt.sign({
                id: 1,
                name: "UnitTester",
                role: "Speaker"
            }, config.secret, {expiresIn: 86400} // 24 hours
        );

        return request(app)
            .get('/poll/count/1')
            .set('x-access-token', token)
            .then(function (res) {
                console.log(res.body);
                assert.strictEqual(res.statusCode, 201);
            });
    });


    it('test deleting a poll by id.', function () {
        const token = jwt.sign({
                id: 1,
                name: "UnitTester",
                role: "Speaker"
            }, config.secret, {expiresIn: 86400} // 24 hours
        );

        return request(app)
            .delete('/poll/delete/1')
            .set('x-access-token', token)
            .then(function (res) {
                assert.strictEqual(res.statusCode, 201);
            });
    });
});
