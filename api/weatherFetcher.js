// Packages
var request = require('request');
var MongoClient = require('mongodb').MongoClient;


// Global variables
var urlDB = "mongodb://node:node@localhost:27017/weather" ;
var apiKey = "8408d5a5dec2bade63fb966902132c14";
var url = "https://api.forecast.io/forecast/"+apiKey+"/";
// Coordonnees 
var coord=[48.8325012787,2.32540116669];
var coord16=[48.871668,2.246229];
var coord20=[48.872747269,2.4082034543];
var coord1001=[48.8570916352, 2.34174799516];

// var the_interval = 0.1 * 60 * 1000; // = every 15min because interval is set in milliseconds 


function feedDB(urlDB,urlAPI,pos){
    MongoClient.connect(urlDB, function(err,db) {
       // fetch JSON
        urlAPI=urlAPI+String(pos[0])+","+String(pos[1]);
        request(urlAPI, function(error,res,body) {
            if(!error && res.statusCode == 200){
                var myjson=JSON.parse(body)['currently'];
                myjson.coord=String(pos[0])+","+String(pos[1]);
                var weatherCollec=db.collection('weather');
                weatherCollec.insertOne(myjson,function(err,result){
                    console.log(err);
                    db.close();
                });
            } else {
                console.log("error in fetching API");
            }
        });
    });
}


feedDB(urlDB,url,coord1001);


// setInterval(function() {
//     console.log("feeding DB");
//     feedDB(urlDB,url,coord1001);
// },the_interval);

