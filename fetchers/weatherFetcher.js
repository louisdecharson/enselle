// Packages
var request = require('request'),
    MongoClient = require('mongodb').MongoClient,
    dotenv = require('dotenv'),
    path = require('path'),
    assert = require('assert'),
    winston = require('winston');


require('dotenv').config({path:path.join(__dirname,'/../config/.env')});



// Global variables
var urlDB = "mongodb://"+  process.env.DB_WEATHER_USER + ':' + process.env.DB_WEATHER_PASS + '@' + process.env.DB_HOST + ':' + process.env.DB_PORT + '/' + process.env.DB_WEATHER,
    apiKey = process.env.FORECAST_APIKEY;

var url = "https://api.forecast.io/forecast/"+apiKey+"/";

// Coordonnees 
var coord=[48.8624302348,2.33852013115]; // coordonées de la station 1013


function feedDB(urlDB,urlAPI,pos){
    MongoClient.connect(urlDB, function(err,db) {
        assert.equal(null,err);
        
       // fetch JSON
        urlAPI=urlAPI+String(pos[0])+","+String(pos[1]);
        console.log(urlAPI);
        request(urlAPI, function(error,res,body) {
            if(!error && res.statusCode == 200){
                var myjson=JSON.parse(body)['currently'];
                myjson.coord=String(pos[0])+","+String(pos[1]);
                db.collection('weather').insertOne(myjson,function(err,result){
                    db.close();
                });
            } else {
                console.log("error in fetching API");
            }
        });
    });
}


feedDB(urlDB,url,coord);


