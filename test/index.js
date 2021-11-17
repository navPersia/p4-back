"use strict";

const assert = require('assert');
const request = require('supertest');
const app = require('../app');

describe('Unit testing the / route', function () {

    it('test index page', function () {
        return request(app)
            .get('/')
            .then(function (response) {
                assert(response.text, "home page");
            });
    });

    it('test url query', function () {
        return request(app)
            .get('/')
            .query({q: 'test'})
            .then(function (response) {
                assert(response.text, 'test');
            });
    });
});
