"use strict";
var http = require('http'),
    express = require('express'),
    bodyParser = require('body-parser');
var port = process.env.PORT || 3000;

var config = require('./config.json');

var loginData = {
    user: config.user,
    password: config.password,
    dbAddress: config.address,
    dbPort: config.port,
    databaseName: config.database
};

var app = express();
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
//connect to postgreSQL database
var pg = require('pg');
var conString = "postgres://" + loginData.user + ":" + loginData.password + "@" + loginData.dbAddress + ":" + loginData.dbPort + "/" + loginData.databaseName;
var client = new pg.Client(conString);

client.connect(function (err) {
    if (err) {
        return console.error('Could not connect to postgres', err);
    }
});

app.use(bodyParser.json({ extended: true }));

app.post('/', function (request, response) {
    client.query("INSERT INTO data(temperature, battery) values(" + request.body.temperature + "," + request.body.battery+");");
    response.send('successfull');
});

app.get('/', function (request, response) {
    client.query("SELECT temperature, battery FROM data;", {}, function (err, result) {
        if (err) {
            return next(err);
        }
        response.json(result.rows);
    });
});

app.get('*', function (req, res) {
    res.status(404).send('Unrecognised API call');
});

app.use(function (err, req, res, next) {
    if (req.xhr) {
        res.status(500).send('Oops, Something went wrong!');
    } else {
        next(err);
    }
});

app.listen(3000);