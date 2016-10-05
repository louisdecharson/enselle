// Copyright (C) 2016 Louis de Charsonville

var mongo = require('mongodb'),
    path = require('path'),
    assert = require('assert');

require('dotenv').config({path:path.join(__dirname,'/../../config/.env')});

var Server = mongo.Server,
    MongoClient = mongo.MongoClient,
    Db = mongo.Db,
    ObjectId = mongo.ObjectId;

var url = 'mongodb://' + process.env.DB_USER + ':' + process.env.DB_PASS + '@' + process.env.DB_HOST + ':' + process.env.DB_PORT +  '/' + process.env.DB_NAME;

// for HTML
// ====================
var meta = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd"><html><head><meta charset="utf-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1">',
    jQuery = '<script src="./../bower_components/jquery/dist/jquery.min.js"></script>',
    bootstrap = '<link rel="stylesheet" type=text/css href="./../bower_components/bootstrap/dist/css/bootstrap.min.css"><script src="./../bower_components/bootstrap/dist/js/bootstrap.min.js"></script>',
    listJS = '<script src="./../bower_components/list.js/dist/list.min.js"></script>',
    jsforListJS = "<script>var options = {valueNames: ['name', 'address'], searchClass: 'form-control'}; var dataList = new List('myStations',options);</script>",
    enSelleCSS = '<link rel="stylesheet" type=text/css href="./../css/enSelle.css">',
    dyGraph = '<script src="./../bower_components/dygraphs/dygraph-combined.js"></script>',
    mapBG = '<div class="mapBG">',
    navbar = '<nav class="navbar navbar-default navbar-fixed-top" role="navigation"> <div class="container"> <div class="navbar-header"> <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar"> <span class="sr-only">Toggle navigation</span> <span class="icon-bar"></span> <span class="icon-bar"></span> <span class="icon-bar"></span> </button> <a class="navbar-brand" href="/"><span><img src="./../img/logo.png" alt="logo" width="30"> enSelle</a><span> </div> <div class="navbar-collapse collapse" id="navbar"> <ul class="nav navbar-nav navbar-left"> <li><a class="navbar" href="/about.html">About</a></li> <li><a class="navbar" href="/stations/">Stations</a></li> <li><a class="navbar" href="/map.html">Carte</a></li> </ul> <ul class="nav navbar-nav navbar-right"> <li><a class="navbar" href="mailto:hello@enselle.io?Subject=Hi%20enSelle">Contact</a></li><li><a class="navbar" href="http://api.enselle.io">API</a></li> </ul> </div></div></nav>';
// ==================



function makeTable(items) {
    var title = '';
    var body = '',
        table = '',
        theader = '<th>Name</th><th>Address</th><th>Bikes</th><th>Stands</th>',
        tbody = '';
    body += '<div id="myStations"><h2>Velib stations</h2>'; // for ListJS
    body += '<input class="form-control" placeholder="Search"><br>';

    items.forEach(function (item, index) {
        tbody += '<tr>';
        tbody += '<td class="name"><a href="/station/' + item.id_station +
            '">' + item.name + '</a>' + '</td>';
        tbody += '<td class="address">' + item.address + '</td>';
        tbody += '<td class="address">' + item.bikes + '</td>';
        tbody += '<td class="address">' + item.stands + '</td>';
        tbody += '</tr>';
    });
    var myHTML = meta + title + jQuery + bootstrap + enSelleCSS + '</head><body>'  + mapBG + navbar + body  + '<table class="table table-condensed table-hover">' + '<thead>'  + '<tr>' + theader + '</tr>' + '</thead>' + '<tbody class="list">' + tbody + '</tbody>'  +'</table></div>' + listJS  + jsforListJS + '</div></body></html>';

    return myHTML;
};


function pageStation(maStation,lastItem,arr24h,stats) {
    var pageWrapper = '<div class="pageWrapper">';
    var title = '',
        myGMap = '<iframe width="500px" height="300px" frameborder="0" style="border:0" src="https://www.google.com/maps/embed/v1/place?key=AIzaSyCLIuSIWGEbQA8rRFHB_0YtKRMaYDXWDWk&q=' + maStation.coord[0].toString() + ',' + maStation.coord[1].toString() + '&zoom=15"></iframe>';
    
    var monGraph = "<div id='graphdiv'></div>";
    
    // On remplit le vecteur pour le graph avec date, vélos, stands.
    var jsforGraph = '<script type="text/javascript"> g = new Dygraph(document.getElementById("graphdiv"),[';
    arr24h.sort(function(a,b) {
        var c = new Date(a.timestamp),
            d = new Date(b.timestamp);
        return c-d;
    });
        
    arr24h.forEach(function(it) {
        jsforGraph += '[new Date(' + it.timestamp + '),' + [it.bikes,it.stands].toString() + '],';
    });
    jsforGraph += '],{labels: ["date","bikes","stands"], legend: "always", colors: ["#332A6C","#974D39"]});</script>';

    var nomStation = '<div class="nomStation"><h3>Station: '+ maStation.name + '</h3></div>',
        rowContainer = '<div class="container"><div class="row">',
        coldroite = '<div class="col-sm-6">',
        colgauche = '<div class="col-sm-6">';

    var dernierVelos = '<div class="dernierVelo">Bikes: ' + lastItem.bikes + ' (' + stats.bikes_moy  +')'  + ' Stands: ' + lastItem.stands + ' (' + stats.stands_moy  +')' + '</div>';
    var monAdresse = '<div class="myAddress">Address : ' + maStation.address  + '</div>';

    var myHTML = meta + title + jQuery + bootstrap + dyGraph + enSelleCSS + '</head><body>' + mapBG  + navbar +  pageWrapper + nomStation  + rowContainer + colgauche + dernierVelos + monGraph + '</div>' + coldroite  + monAdresse + myGMap +  '</div></div></div>' + jsforGraph +'</body></html>';
    return myHTML;
}


// ============================================================



exports.getListe = function(req,res) {
    MongoClient.connect(url, function(err,db) {
        assert.equal(null,err);
        db.collection('stations').find({},{"name":1, "address":1, "id_station":1, "bikes":1, "stands":1}).toArray(function(err,items) {
            assert.equal(err,null);
            if (items != null) {
                res.send(makeTable(items));
                db.close();
            }
        });
    });
};


exports.getStation = function(req,res) {

    var today = new Date(),
        heure = today.getHours(),
        min = today.getMinutes(),
        weekend = (today.getDay() > 5),
        timestamp = today.getTime(),
        timestamp_hier = new Date(timestamp-1000*60*60*24),
        bikes_moy = 0,
        stands_moy = 0,
        bikes_lastHour = 0,
        stands_lastHour = 0,
        compt = 0,
        arr24h = [],
        lastItem = '';
    MongoClient.connect(url, function(err,db) {
        assert.equal(null,err);
        var stationId = Number(req.params.station);
        db.collection('stations').findOne({"id_station": stationId}, function(err,doc) {
            assert.equal(err,null);
            var maStation = doc;
            var cursor = db.collection('velos').find({"id_station": stationId},{"time":1, "bikes":1, "stands":1, "timestamp":1, "_id":0}).limit(2000);

            cursor.each(function(err,item) {
                assert.equal(err,null);
                if (item != null && item.time[3] === heure) {
                    bikes_moy += item.bikes,
                    stands_moy += item.stands;
                    compt ++;
                }
                // On récupère les vélos des dernières 24h
                if (item != null && item.timestamp > timestamp_hier ) {
                    arr24h.push(item);
                }
                // Vélos moyens pour l'heure en cours
                if (item == null) {
                    var stats = {"bikes_moy": Math.floor(bikes_moy/compt), stands_moy: Math.floor(stands_moy/compt)};
                    res.send(pageStation(maStation,lastItem,arr24h,stats));
                    db.close();
                } else {
                    lastItem = item; // dernier vélo pour affichage.
                }
            });
        });
    });
};
