"use strict";
const createError = require('http-errors');
const express = require('express');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const pollRouter = require('./routes/poll');
const roomRouter = require('./routes/room');
const chatRouter = require('./routes/chat');
const feedbackRouter = require('./routes/feedback');

const cors = require('cors');

const app = express();
app.use(cors());


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/room', roomRouter);
app.use('/poll', pollRouter);
app.use('/chat', chatRouter);
app.use('/feedback', feedbackRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.send('error');
});

module.exports = app;
