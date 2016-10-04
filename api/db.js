var mongo = require('mongodb'),
    path = require('path');


require('dotenv').config({path:'./../config/.env'});

var url = 'mongodb://' + process.env.DB_USER + ':' + process.env.DB_PASS + '@' + process.env.DB_HOST + ':27017/' + process.env.DB_NAME;


var MongoClient = mongo.MongoClient;

var state = {
    db: null
};


exports.connect = function(url, done) {
    if (state.db) return done();

  MongoClient.connect(url, function(err, db) {
      if (err) return done(err);
      state.db = db;
      done();
  });
};

exports.get = function() {
    return state.db;
};

exports.close = function(done) {
  if (state.db) {
    state.db.close(function(err, result) {
        state.db = null;
        state.mode = null;
        done(err);
    });
  }
};
