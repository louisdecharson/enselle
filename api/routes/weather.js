var mongo = require('mongodb'),
    assert = require('assert'),
    path = require('path'),
    fs = require('fs');

var Server = mongo.Server,
    MongoClient = mongo.MongoClient,
    Db = mongo.Db,
    ObjectId = mongo.ObjectId;

require('dotenv').config({path:path.join(__dirname,'/../../config/.env')});

var url = "mongodb://"+  process.env.DB_WEATHER_USER + ':' + process.env.DB_WEATHER_PASS + '@' + process.env.DB_HOST + ':' + process.env.DB_PORT + '/' + process.env.DB_WEATHER;

exports.findAll= function(req,res) {
    MongoClient.connect(url, function(err,db){
        assert.equal(null,err);
        db.collection('weather').find({},{"_id":0}).toArray(function(err,items){
            assert.equal(err,null);
            if (items !=null){
                res.send(items);
            } else {
                res.send("ERROR - THE DATABASE IS EMPTY");
            };
        });
    });
};
       

exports.findbyTime = function(req, res) {
    MongoClient.connect(url, function(err,db) {
        assert.equal(null,err);
        var time = Number(req.params.time);
        console.log('Retrieving weather at time : ' + time);
        var cursor =  db.collection('weather').find({"time":time}, {"_id":0});
        cursor.each(function(err,item){
            assert.equal(err,null);
            if (item != null){
                res.send(item);
            } else {
                res.send("ERROR - CANNOT FIND ITEM");
            }
        });
    });
};

exports.forecast = function (req,res) {
    fs.readFile("fcst.json",'utf-8',function(err,data){
        if (err) {
            res.send(err);
        }
        res.send(data);
    });
};
