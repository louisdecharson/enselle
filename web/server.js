// Copyright (C) 2016 Louis de Charsonville

// Packages
var express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    stations = require('./routes/stations'),
    favicon = require('serve-favicon');


require('dotenv').config({path:path.join(__dirname,'/../config/.env')});


var app = express();


var port = process.env.Port || 8080;


app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use('/',express.static(__dirname + '/public/'));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));

// Favicon
// app.use(favicon(path.join(__dirname,'public','favicon.ico')));

// NO ROBOTS
app.get('/robots.txt', function (req, res) {
    res.type('text/plain');
    res.send("User-agent: *\nDisallow: /");
});

// ROUTES
app.get('/stations', stations.getListe);
app.get('/station/:station', stations.getStation);


// Listen
app.listen(port,function() {
    console.log('enSelle web is running on port ' + port);
});



