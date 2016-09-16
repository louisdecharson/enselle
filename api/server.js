var express = require('express'),
    path = require('path'),
    stations = require('./routes/stations'),
    weather = require('./routes/weather'),
    bodyParser = require('body-parser');

require('dotenv').config({path:'./../config/.env'});

var app = express();
var router = express.Router();

var port = process.env.Port || 3000;


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

app.get('/weather', weather.findAll);
app.get('/weather/:time',weather.findbyTime);
app.get('/fcst',weather.forecast);


app.listen(port,function() {
    console.log('enSelle api is running on port ' + port);
});
