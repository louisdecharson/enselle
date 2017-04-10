var express = require('express'),
    path = require('path'),
    mongo = require('mongodb'),
    assert = require('assert'),
    stations = require('./routes/stations'),
    weather = require('./routes/weather'),
    bodyParser = require('body-parser');

require('dotenv').config({path:'./../config/.env'});

var app = express();
const port = process.env.Port || 3000;

var url = 'mongodb://' + process.env.DB_USER + ':' + process.env.DB_PASS + '@' + process.env.DB_HOST + ':27017/' + process.env.DB_NAME;


// Initialize connection once
var db = require('./db');
db.connect(url,function(err,database) {
    if(err) throw err;
    
    app.listen(port,function() {
        console.log('enSelle api is running on port ' + port);
    });
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended" : false}));

// NO ROBOTS
app.get('/robots.txt', function (req, res) {
    res.type('text/plain');
    res.send("User-agent: *\nDisallow: /");
});

app.use('/',express.static(__dirname + '/public/'));
app.get('/connect',stations.hello);
app.get('/stations', stations.findAll);
app.get('/stations/:station_id', stations.findbyStationId);
app.get('/f/:station_id',stations.forecast);

// 404
app.use(function(req, res){
    res.status(404).send("ERROR 404");
});


