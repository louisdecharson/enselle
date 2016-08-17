var mongo = require('mongodb'),
    assert = require('assert'),
    fs = require('fs');

var Server = mongo.Server,
    MongoClient = mongo.MongoClient,
    Db = mongo.Db,
    ObjectId = mongo.ObjectId;

var url = 'mongodb://node:node@localhost:27017/weather';

exports.findAll= function(req,res) {
    MongoClient.connect(url, function(err,db){
        assert.equal(null,err);
        db.collection('weather').find({},{"_id":0}).toArray(function(err,items){
            assert.equal(err,null);
            if (items !=null){
                res.send(items);
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
            };
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
