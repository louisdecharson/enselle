var mongo = require('mongodb'),
    path = require('path'),
    assert = require('assert');

require('dotenv').config({path:path.join(__dirname,'/../../config/.env')});

var Server = mongo.Server,
    MongoClient = mongo.MongoClient,
    Db = mongo.Db,
    ObjectId = mongo.ObjectId;

var url = 'mongodb://' + process.env.DB_USER + ':' + process.env.DB_PASS + '@' + process.env.DB_HOST + ':27017/' + process.env.DB_NAME;

exports.hello=function(req,res) {
    MongoClient.connect(url, function(err,db) {
        assert.equal(null,err);
        res.send({error: "false", message:"Successfuly connected to enselle RESTful API"});
        db.close();
    });
};

                        
exports.findAll= function(req,res) {
    MongoClient.connect(url, function(err,db){
        assert.equal(null,err);
        db.collection('stations').find({},{"coord":1, "name":1, "address":1 ,"id_station":1,"bikes":1, "stands":1,"_id":0}).toArray(function(err,items){
            assert.equal(err,null);
            if (items !=null){
                res.send(items);
            };
        });
    });
};
       

exports.findbyStationId = function(req, res) {
    MongoClient.connect(url, function(err,db) {
        assert.equal(null,err);
        var stationId = Number(req.params.station_id);
        var cursor =  db.collection('velos').find({"id_station":stationId}, {"time":1, "bikes":1, "stands":1,"timestamp":1, "_id":0}).toArray(function(err,items){
            assert.equal(err,null);
            if (items != null){
                res.send(items);
            };
        });
    });
};



