"use strict";
const db = require("../config/db.config");

const Room = function (room) {
    this.active = true;
    this.name = room.roomname;
    this.startDate = room.startDate;
    this.endDate = room.endDate;
    this.info = room.info;
    this.sprekerId = room.userID;
};

Room.createRoom = function (data, result) {
    db.query("INSERT INTO room (active, name, startDate, endDate, info, sprekerId) VALUES (? ,? ,? ,? ,?, ?);", [true, data.name, data.startDate, data.endDate, data.info, parseInt(data.userID)], function (err, res) {
        if (err) {
            console.log("error createRoom: ", err);
            result(err, null);
            return;
        }
        console.log("room created");
        result(null, {kind: "Room Created"});
    });
};

Room.edit = function (data, id, result) {
    // data = {name: 'new name', ...}
    db.query("UPDATE room SET " + db.escape(data) + " WHERE id = " + db.escape(id) + ";", function (err, res) {
        if (err) {
            console.log("error edit: ", err);
            result(err, null);
            return;
        }
        if (res.message) {
            console.log("edited room");
            result(null, res);
            return;
        }
        // not found Room with the id
        result({kind: "not_found"}, null);
    });
};

Room.deleteById = function (id, result) {
    db.query('DELETE FROM messaging WHERE roomId = ? ;', [id], function (err) {
        if (err) {
            console.log("error deleteById messaging : ", err);
        }
    });
    db.query('DELETE FROM voteuser USING voteuser INNER JOIN poll WHERE voteuser.pollId = poll.id AND poll.roomId = ?;', [id], function (err) {
        if (err) {
            console.log("error deleteById voteuser : ", err);
        }
    });
    db.query('DELETE FROM poll WHERE roomId = ? ;', [id], function (err) {
        if (err) {
            console.log("error deleteById poll : ", err);
        }
    });
    db.query('DELETE FROM roomlogin WHERE roomId = ? ;', [id], function (err) {
        if (err) {
            console.log("error deleteById roomLogin : ", err);
        }
    });
    db.query('DELETE FROM room WHERE id = ? ;', [id], function (err, res) {
        if (err) {
            console.log("error deleteById room : ", err);
            result(err, null);
            return;
        }
        console.log("delete Room: ", res);
        result(null, res);
    });
};

Room.login = function (roomId, userId, result) {
    const date = new Date();
    const dateFormated = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2) + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    db.query("INSERT INTO roomlogin (userId, roomId, startDate) VALUES (?, ?, ?);", [userId, roomId, dateFormated], function (err, res) {
        if (err) {
            console.log("error login: ", err);
            result(err, null);
            return;
        }
        if (res.insertId) {
            console.log("loged in: ", res[0]);
            result(null, res[0]);
            return;
        }
        // not found Room with the id
        result({kind: "not_found"}, null);
    });
};

Room.logout = function (roomId, userId, result) {
    const date = new Date();
    const dateFormated = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2) + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    db.query("UPDATE roomlogin SET endDate = ? WHERE userId = ? AND roomId = ?;", [dateFormated, userId, roomId], function (err, res) {
        if (err) {
            console.log("error logout: ", err);
            result(err, null);
            return;
        }
        result(null, res);
    });
};

Room.getall = function (result) {
    db.query("SELECT * FROM room;", function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        console.log("found rooms");
        result(null, res);
    });
}

Room.getbyid = function (id, result) {
    db.query("SELECT * FROM room WHERE id = ?;", [id], function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        if (res.length) {
            console.log("found room by id");
            result(null, res[0]);
            return;
        }
        // not found Customer with the id
        result({kind: "not_found"}, null);
    });
}

Room.getbydate = function (id, searchdate, result) {
    const date = Date(searchdate - 900000); // 900000 ms = 15 min
    db.query("SELECT * FROM room WHERE id = ? AND startDate >= ?;", [id, date], function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        if (res.length) {
            console.log("found room by id and date");
            result(null, res[0]);
            return;
        }
        // not found Customer with the id
        result({kind: "not_found"}, null);
    });
}

module.exports = Room;
