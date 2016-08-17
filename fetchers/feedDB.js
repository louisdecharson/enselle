// Packages
var request = require('request'),
    MongoClient = require('mongodb').MongoClient,
    assert = require('assert'),
    winston = require('winston');

// Variables 
var db = "mongodb://feedDB:feed2213@localhost:27017/velib";
var url = "http://opendata.paris.fr/api/records/1.0/search/?dataset=stations-velib-disponibilites-en-temps-reel&rows=1240&facet=banking&facet=bonus&facet=status&facet=contract_name";

// Log
winston.add(winston.transports.File, { filename: 'feedDB.log' });
winston.remove(winston.transports.Console);

var insertDocs = function(db,records,temps,callback) {    
    for(var i=0; i<records.length;i++) {
        var compteur = 2*records.length;
        var fields = records[i]['fields'];

        // Stations
        db.collection('stations').updateOne(
            {"id_station" : fields['number']},
            { $set:
              {
                  "id_station" : fields['number'],
                  "name" :  fields['name'],
                  "address" : fields['address'],
                  "coord" : fields['position'],
                  "bonus" : fields['bonus'],
                  "status" : fields['status'],
                  "bikes": fields['available_bikes'],
                  "stands" : fields['available_bike_stands'],
                  "total_stands" : fields['bike_stands']
              }
            },
            {upsert:true},
            function(err,results){
                if(err) {
                    winston.log('error',err);
                }
                else {
                    compteur--;
                    if(compteur==0){
                        callback();
                    }
                }
            }
        );
        // Velos
        db.collection('velos').insertOne(
            {
                "id_station" : fields['number'],
                "last_update"  : fields['last_update'],
                "time" : [temps.getFullYear(),temps.getMonth(),temps.getDate(),temps.getHours(),temps.getMinutes()],
                "timestamp": temps.getTime(),
                "weekend" : (temps.getDay() > 5),
                "bikes" : fields['available_bikes'],
                "stands" : fields['available_bike_stands'],
                "status" : fields['status']
            },
            function(err,results){
                if(err) {
                    winston.log('error',err);
                } else {
                    compteur--;
                    if(compteur==0){
                        callback();
                    }
                }
            }
        );
    };
};

function feedDB(db,url,callback){
    MongoClient.connect(db,{server : {socketOptions : {connectTimeoutMS: 1000}}},function(err,db){        
        request(url,function(error,res,body){
            if(!error && res.statusCode == 200){
                var temps = new Date();
                var records = JSON.parse(body)['records'];
                insertDocs(db,records,temps,function(){
                    db.close();
                    callback('success');
                });
            } else {
                winston.log('error',error);
                callback('error');
            }
        });
    });
}
var success = false;
feedDB(db,url, function(str) {
    if (str === 'success') {
        winston.log('info','database sucessfully updated');
    } else {
        winston.log('warn','errors occured');
    }
});

