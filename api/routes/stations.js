var mongo = require('mongodb'),
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
    var cursor =  db.get().collection('velos').find({"id_station":stationId}, {"time":1, "bikes":1, "stands":1,"timestamp":1, "_id":1}).sort({$natural:-1}).limit(100).toArray(function(err,items){
        assert.equal(err,null);
        if (items != null){
            res.send(items);
        };
    });
};



