"use strict";

const express = require('express');
const router = express.Router();
const db = require("../config/db.config");

/* GET index page. */
router.get('/', function (req, res, next) {
    res.send("index page. <br> laatste update 17/02/21 18:47");
});

// router.get('/show', function (req, res, next) {
//     const lkl = db.query("SELECT * FROM AUser;", function (error, results, fields) {
//         if (error) {
//             throw error;
//         }
//         // Needs to be here cause don't know how to extract results from the query function.
//         res.send(results);
//     });
// });

module.exports = router;
