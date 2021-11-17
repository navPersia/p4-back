"use strict";

const db = require("../config/db.config");

const User = function User(user) {
    this.username = user.username;
    this.name = user.name;
    this.password = user.password;
    this.role = user.role;
    this.adGUID = user.adGUID;
};

User.findByUsername = function (username, result) {
    db.query("SELECT * FROM auser WHERE username = ?;", [username], function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        if (res.length) {
            console.log("found customer: ", res[0]);
            result(null, res[0]);
            return;
        }
        // not found Customer with the id
        result({kind: "not_found"}, null);
    });
};

User.findById = function (id, result) {
    db.query("SELECT * FROM auser WHERE id = ?;", [id], function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        if (res.length) {
            console.log("found customer: ", res[0]);
            result(null, res[0]);
            return;
        }
        // not found Customer with the id
        result({kind: "not_found"}, null);
    });
};

User.deleteById = function (id, result) {
    db.query("DELETE FROM auser WHERE id = ?;", [id], function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        if (res.length) {
            console.log("found customer: ", res[0]);
            result(null, res[0]);
            return;
        }
        // not found Customer with the id
        result({kind: "not_found"}, null);
    });
};

User.createUser = function (data, result) {
    db.query("INSERT INTO auser (role, username, password, ActiveDirectoryGUID) VALUES (?,?,?,?);", [data.role, data.username, data.password, "testOk"], function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        if (res.length) {
            console.log("found customer: ", res[0]);
            result(null, res[0]);
            return;
        }
        // not found Customer with the id
        result({kind: "not_found"}, null);
    });
};

User.getAllUsers = function (result) {
    db.query("SELECT * FROM auser;", function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        if (res.length) {
            console.log("found users");
            result(null, res);
            return;
        }
        // not found Customer with the id
        result({kind: "not_found"}, null);
    });
};

User.updateUser = function (id, data, result) {
    db.query("UPDATE auser SET role = ?, username = ?, password = ? WHERE id = ?;", [data.role, data.username, data.password, id], function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        if (res.length) {
            console.log("found users");
            result(null, res);
            return;
        }
        // not found Customer with the id
        result({kind: "not_found"}, null);
    });
};

module.exports = User;
