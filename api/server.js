var express = require('express'),
    stations = require('./routes/stations'),
    weather = require('./routes/weather'),
    bodyParser = require('body-parser');

var app = express();
var router = express.Router();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended" : false}));


app.get('/',stations.hello);
app.get('/stations', stations.findAll);
app.get('/stations/:station_id', stations.findbyStationId);

app.get('/weather', weather.findAll);
app.get('/weather/:time',weather.findbyTime);
app.get('/fcst',weather.forecast);

app.listen(3000);
console.log('Listening on port 3000...');
