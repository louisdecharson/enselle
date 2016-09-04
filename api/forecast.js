// Packages
var request = require('request');
var fs = require('fs'),
    path = require('path');

require('dotenv').config({path:path.join(__dirname,'/../config/.env')});


var apiKey = process.env.FORECAST_APIKEY;
var url = "https://api.forecast.io/forecast/"+apiKey+"/";

var coord=[48.8624302348,2.33852013115]; // coordonées de la station 1013

function writeJSON(urlAPI,pos){
    urlAPI=urlAPI+String(pos[0])+","+String(pos[1]);
    request(urlAPI,function(error,res,body){
        if(!error && res.statusCode == 200) {
            var myjson0 = JSON.parse(body)['hourly']['data'];
            var myjson = {};
            myjson['lastModified'] =  Math.round(new Date().getTime()/1000);
            myjson['data']=myjson0;
            myjson=JSON.stringify(myjson);
            fs.writeFile("fcst.json",myjson,function(err) {
                if (err) {
                    console.log(err);
                };
            });
        }
        else {
            console.log("error in request");
            console.log("url: "+urlAPI);
        };
    });
}

writeJSON(url,coord);

fs.readFile("fcst.json",'utf-8',function(err,data){
    if (err) {
        console.log(err);
    }
});

