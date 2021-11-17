"use strict";

const assert = require('assert');
const request = require('supertest');
const app = require('../app');
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");

describe('Unit testing the /users/ route', function () {
    //  Dit is nodig om unit test uit te voeren.

    //     create table auser(
    //         id                  int auto_increment,
    //         role                varchar(255) not null,
    //         ActiveDirectoryGUID varchar(255) not null,
    //         username            varchar(255) not null,
    //         password            varchar(255) not null,
    //         constraint id
    //     unique (id)
    //     );
    //
    //     alter table auser
    //     add primary key (id);
    //
    //     INSERT INTO Axxes.auser (id, role, ActiveDirectoryGUID, username, password) VALUES (1, 'Admin', 'GUID', 'username123', 'password123');

    it('test if login works.', function () {
        return request(app).post('/users/login').send({
            "password": "password123",
            "username": "username123"
        }).then(function (res) {
            assert.strictEqual(res.statusCode, 200);
            assert.strictEqual(res.body.message, "Valid login");
        });
    });

    it('test if /:id works as admin', function () {
        const token = jwt.sign({
                id: 1,
                name: "UnitTester",
                role: "Admin"
            }, config.secret, {expiresIn: 86400} // 24 hours
        );

        return request(app).get('/users/1').set('x-access-token', token).then(function (res) {
            assert.strictEqual(res.statusCode, 200);
            assert.strictEqual(res.body.id, 1);
            assert.strictEqual(res.body.password, 'password123');
        });
    });

    it('test if GET /:id works as user', function () {
        const token = jwt.sign({
                id: 1,
                name: "UnitTester",
                role: "User"
            }, config.secret, {expiresIn: 86400} // 24 hours
        );

        return request(app).get('/users/1').set('x-access-token', token).then(function (res) {
            assert.strictEqual(res.statusCode, 200);
            assert.strictEqual(res.body.id, 1);
            assert.strictEqual(res.body.password, null);
        });
    });

    it('test if GET / works as admin', function () {
        const token = jwt.sign({
                id: 1,
                name: "UnitTester",
                role: "Admin"
            }, config.secret, {expiresIn: 86400} // 24 hours
        );

        return request(app).get('/users/').set('x-access-token', token).then(function (res) {
            assert.strictEqual(res.statusCode, 200);
        });
    });

    it('test if GET / works as user', function () {
        const token = jwt.sign({
                id: 1,
                name: "UnitTester",
                role: "User"
            }, config.secret, {expiresIn: 86400} // 24 hours
        );

        return request(app).get('/users/').set('x-access-token', token).then(function (res) {
            assert.strictEqual(res.statusCode, 403);
            assert.strictEqual(res.body.message, "You are not permitted");
        });
    });

    it('test if DELETE /:id works as admin', function () {
        const token = jwt.sign({
                id: 1,
                name: "UnitTester",
                role: "Admin"
            }, config.secret, {expiresIn: 86400} // 24 hours
        );

        return request(app).delete('/users/2').set('x-access-token', token).then(function (res) {
            assert.strictEqual(res.statusCode, 200);
            assert.strictEqual(res.body.message, "deleted");
        });
    });

    it('test if DELETE /:id works as user', function () {
        const token = jwt.sign({
                id: 1,
                name: "UnitTester",
                role: "User"
            }, config.secret, {expiresIn: 86400} // 24 hours
        );

        return request(app).delete('/users/1').send().set('x-access-token', token).then(function (res) {
            assert.strictEqual(res.statusCode, 403);
            assert.strictEqual(res.body.message, "You are not permitted");
        });
    });

    it('test if POST /:id works as admin', function () {
        const token = jwt.sign({
                id: 1,
                name: "UnitTester",
                role: "Admin"
            }, config.secret, {expiresIn: 86400} // 24 hours
        );

        return request(app).delete('/users/1').set('x-access-token', token).then(function (res) {
            assert.strictEqual(res.statusCode, 200);
            assert.strictEqual(res.body.message, "deleted");
        });
    });

    it('test if POST /:id works as user', function () {
        const token = jwt.sign({
                id: 1,
                name: "UnitTester",
                role: "User"
            }, config.secret, {expiresIn: 86400} // 24 hours
        );

        return request(app).delete('/users/1').set('x-access-token', token).then(function (res) {
            assert.strictEqual(res.statusCode, 403);
            assert.strictEqual(res.body.message, "You are not permitted");
        });
    });

    it('test if POST / works as user', function () {
        const token = jwt.sign({
                id: 1,
                name: "UnitTester",
                role: "User"
            }, config.secret, {expiresIn: 86400} // 24 hours
        );

        const user = {
            'role': 'User',
            'name': 'Unitcreatetest',
            'username': 'createTest',
            'password': 'password12'
        };

        return request(app).post('/users/').send(user).set('x-access-token', token).then(function (res) {
            assert.strictEqual(res.statusCode, 403);
            assert.strictEqual(res.body.message, "You are not permitted");
        });
    });

    it('test if POST / works as admin', function () {
        const token = jwt.sign({
                id: 1,
                name: "UnitTester",
                role: "Admin"
            }, config.secret, {expiresIn: 86400} // 24 hours
        );

        const user = {
            'role': 'User',
            'name': 'Unitcreatetest',
            'username': 'createTest',
            'password': 'password12'
        };

        return request(app).post('/users/').send(user).set('x-access-token', token).then(function (res) {
            assert.strictEqual(res.statusCode, 200);
            assert.strictEqual(res.body.message, "success");
        });
    });
});
