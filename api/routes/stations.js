const mongo = require('mongodb'),
      path = require('path'),
      assert = require('assert');

require('dotenv').config({path:path.join(__dirname,'/../../config/.env')});

var Server = mongo.Server,
    MongoClient = mongo.MongoClient,
    Db = mongo.Db,
    ObjectId = mongo.ObjectId;

var db = require('../db');
        
exports.hello=function(req,res) {
    if (db.get()) {
        res.send({error: "false", message:"Successfuly connected to enselle RESTful API"});
    }  else {
        res.send({error: "true", message:"Cannot connect to database"});
    }
};

                        
exports.findAll= function(req,res) {
    db.get().collection('stations').find({},{"coord":1, "name":1, "address":1 ,"id_station":1,"bikes":1, "stands":1,"_id":0}).toArray(function(err,items){
        assert.equal(err,null);
        if (items !=null){
            res.send(items);
        };
    });
};
       

exports.findbyStationId = function(req, res) {
    var stationId = Number(req.params.station_id);
    var limit = req.param('limit');
    if (limit === undefined) {
        limit = 200;
    } else {
        limit = Number(limit);
    }
    if (Number.isInteger(limit)) {
        db.get().collection('velos').find({"id_station":stationId}, {"time":1, "bikes":1, "stands":1,"timestamp":1, "weekend": 1, "_id":1}).sort({$natural:-1}).limit(limit).toArray(function(err,items){
            assert.equal(err,null);
            if (items != null){
                res.send(items);
            };
        });
    } else {
        res.send("Limit should be an integer");
    }
};



exports.forecast = function(req,res) {
    var stationId = Number(req.params.station_id);
    var horizon = req.param('h');
    if (horizon === undefined) {
        horizon = 1;
    } else {
        horizon = Math.floor(horizon/5);
    }
    var spawn = require('child_process').spawn,
        py = spawn('python3',['./routes/forecast.py',stationId.toString(),horizon.toString()]),
        ans = '';
    db.get().collection('velos').find({"id_station":stationId}, {"time":1, "bikes":1, "stands":1,"timestamp":1, "weekend": 1, "_id":1}).sort({$natural:-1}).limit(288).toArray(function(err,items){
        assert.equal(err,null);
        if (items != null){
            var dataIn = items;
            py.stdin.write(JSON.stringify(dataIn));
            py.stdin.end();
            py.stderr.on('data',function(data) {
                console.log('ERROR in Python Code: ',data.toString('utf8'));
            });
            py.stdout.on('data',function(data){
                ans += data;
            });
            py.stdout.on('end',function(){
                res.set('Content-type','text/plain');
                res.send(ans);
            });
            py.on('close',function(code,signal){
                if (code !==0){
                    res.set('Content-type','text/plain');
                    res.send('Error');
                    console.log('Exit with code ',code,'Signal:',signal);
                } else {
                    console.log('Forecast done with no errors');
                }
            });
        };
    });
};
