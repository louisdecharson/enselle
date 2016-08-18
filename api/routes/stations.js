var mongo = require('mongodb'),
    assert = require('assert');

require('dotenv').config();

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
        db.collection('station').find({},{"coord":1, "name":1, "address":1 ,"id_station":1,"_id":0}).toArray(function(err,items){
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
        console.log('Retrieving station: ' + stationId);
        var cursor =  db.collection('stations').find({"id_station":stationId}, {"velos.time":1, "velos.bikes":1, "velos.stands":1, "_id":0});
        cursor.each(function(err,item){
            assert.equal(err,null);
            if (item != null){
                res.send(item);
            };
        });
    });
};



