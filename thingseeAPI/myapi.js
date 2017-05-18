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

app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap

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
    var pId = request.body[0].engine.pId;

    //check if id exists, first one has to be put in manually
    client.query("SELECT pId FROM data WHERE pId == " + pId + ";", {}, function (result, err) {
        if (result.length === 0) {
            console.log("Didn't find purpose ID");
            return;
        }
        
    });

    var ts = request.body[0].engine.ts;
    var results = {};

    for (var i = 0; i < request.body[0].senses.length; i++) {
        var current = request.body[0].senses[i];
        if (current.sId === "0x00060100") {
            results["temperature"] = current.val;
        }
        else if (current.sId === "0x00030200") {
            results["battery"] = current.val;
        }       
    }
    //Delete old values (only keep last 20)
    client.query("SELECT * FROM data ORDER BY ts;", function (result) {
        if (result !== null) {
            client.query("DELETE FROM data WHERE id IN (SELECT id FROM (SELECT id, row_number() OVER (ORDER BY ts DESC) RowNumber from data) tt WHERE RowNumber > 20);");
        }
    });
    client.query("INSERT INTO data(temperature, battery, pid, ts) values(" + results.temperature + "," + results.battery + ",'" + pId + "'," + ts + ");", function (err) {
        if (err) {
            console.log(err);
        }

    });
    
});

app.get('/', function (request, response) {
    client.query("SELECT ts, temperature, battery FROM data ORDER BY ts DESC;", {}, function (err, result) {
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