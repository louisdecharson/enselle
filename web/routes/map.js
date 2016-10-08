// Copyright (C) 2016 Louis de Charsonville


var https = require('https'),
    path = require('path'),
    async = require('async');


// GET MAP OF BIKES AND STANDS
require('dotenv').config({path:path.join(__dirname,'/../../config/.env')});


var db = require('../db');
const myPath = "/vls/v1/stations?contract=Paris&apiKey=" + process.env.DECAUX_APIKEY;
const accessToken = process.env.MAPBOX_ACCESSTOKEN;

function geoParser(data, callback) {

    var myjson = {
        "type": "FeatureCollection",
        "features" : []
    };
    
    async.each(data,function(item,cb) {
        var mypoint = {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates" : [
                    item.position.lng,
                    item.position.lat
                ]
            },
            "properties": {
                "title": item.name,
                "description": item.address,
                "bikes": item.available_bikes.toString() ,
                "stands": item.available_bike_stands.toString(),
                "bonus": item.bonus,
                "status": item.status,
                "marker-color": "#332A6C",
                "marker-size": "medium",
                "marker-symbol": item.available_bikes.toString()              
                 }
        };
        myjson.features.push(mypoint);
        cb();
    },function(err) {
        if(err) {
            console.log(err);
        } else {
            callback(myjson);
        }
    });
    
};


exports.getMap = function(req,res) {

    var options = {
        hostname: 'api.jcdecaux.com',
        port: 443,
        path: myPath,
        headers: {
            'connection': 'keep-alive'
        }
    };
    https.get(options, function(result) {
        if (result.statusCode >=200 && result.statusCode < 400) {
            var xml = '';
            result.on('data',function(chunk) {
                xml += chunk;
            });
            result.on('end',function() {
                var json = JSON.parse(xml);
                geoParser(json, function(geojson) {
                    //console.log(geojson);
                    res.render('map',{accessToken: accessToken, geojson: JSON.stringify(geojson)});
                    // res.send(geojson);
                });
            });
        } else {
            var e = "Error:" + result.statusCode;
            res.send(e);
        }
    });
    
};
