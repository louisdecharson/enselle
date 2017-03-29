// Copyright (C) 2016 Louis de Charsonville

var mongo = require('mongodb'),
    path = require('path'),
    request = require('request'),
    assert = require('assert');

require('dotenv').config({path:path.join(__dirname,'/../../config/.env')});

const accessToken = process.env.MAPBOX_ACCESSTOKEN;
const forecast_weather = process.env.FORECAST_APIKEY;
var db = require('../db');

// ============================================================



exports.getListe = function(req,res) {
    db.get().collection('stations').find({},{"name":1, "address":1, "id_station":1, "bikes":1, "stands":1}).toArray(function(err,items) {
        assert.equal(err,null);
        if (items != null) {
            res.render('stations',{stations: items});
        }
    });
};

function getWeather(coord,cb) {
    var url = "https://api.forecast.io/forecast/"+forecast_weather+"/"+coord[1].toString()+','+coord[0].toString();
    request(url,function(error,res,body){
        if(!error && res.statusCode == 200) {
            cb(JSON.parse(body)['currently']['icon'].toUpperCase().split('-').join(('_')));
        } else {
            cb("");
        }
    });
};


exports.getStation = function(req,res) {

    var today = new Date(),
        heure = today.getHours(),
        min = today.getMinutes(),
        weekend = (today.getDay() > 5),
        timestamp = today.getTime(),
        //timestamp_hier = new Date(timestamp-1000*60*60*24),
        bikes_moy = 0,
        stands_moy = 0,
        bikes_lastHour = 0,
        stands_lastHour = 0,
        compt = 0,
        arr24h = [],
        lastItem = '';

    var stationId = Number(req.params.station);
    db.get().collection('stations').findOne({"id_station": stationId}, function(err,doc) {
        assert.equal(err,null);
        var maStation = doc;
        var idStation = maStation.name.substring(0,maStation.name.indexOf('-')-1);
        var nomStation = maStation.name.substring(maStation.name.indexOf('-')+1,maStation.name.length);
        
        //var map = 'https://www.google.com/maps/embed/v1/place?key=AIzaSyCLIuSIWGEbQA8rRFHB_0YtKRMaYDXWDWk&q=' + maStation.coord[0].toString() + ',' + maStation.coord[1].toString() + '&zoom=15';
        var mypoints = {
            "type": "FeatureCollection",
            "features": [
                {"type":"Feature","geometry":{"type":"Point","coordinates":[maStation.coord[1],maStation.coord[0]]},"properties":{"title":nomStation,"description":maStation.address,"marker-color":"#974D39","marker-size":"medium","marker-symbol":0}},
                {"type":"Feature","geometry":{"type":"Point","coordinates":[maStation.coord[1]+1/10000,maStation.coord[0]+1/10000]},"properties":{"title":nomStation,"description":maStation.address,"marker-color":"#332A6C","marker-size":"medium","marker-symbol":0}}
            ]
        };
        var cursor = db.get().collection('velos').find({"id_station": stationId},{"time":1, "bikes":1, "stands":1, "timestamp":1, "_id":0}).sort({$natural:-1}).limit(288);

        cursor.each(function(err,item) {
            assert.equal(err,null);
            if (item != null && item.time[3] === heure) {
                bikes_moy += item.bikes,
                stands_moy += item.stands;
                compt ++;
            }
            // On récupère les vélos des dernières 24h
            if (item != null) {
                arr24h.unshift([item.timestamp, item.bikes, item.stands]);
            }
            // Vélos moyens pour l'heure en cours
            if (item == null) {
                var stats = {"bikes_moy": Math.floor(bikes_moy/compt), "stands_moy": Math.floor(stands_moy/compt)};
                mypoints.features[1].properties['marker-symbol'] = lastItem.bikes.toString();
                mypoints.features[0].properties['marker-symbol'] = lastItem.stands.toString();
                getWeather(maStation.coord, function(icon) {
                    res.render('station',{maStation: maStation, dernierVelo: lastItem, arr: arr24h, stats: stats, nomStation: nomStation, idStation:idStation,accessToken: accessToken, geojson: JSON.stringify(mypoints),icon:icon});
                });
                // res.send(pageStation(maStation,lastItem,arr24h,stats));
            } else {
                lastItem = item; // dernier vélo pour affichage.
            }
        });
    });
};

