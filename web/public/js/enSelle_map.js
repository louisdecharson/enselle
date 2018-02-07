const url_citybike = "https://api.citybik.es/v2/networks/velib";
const url_villeParis = "https://opendata.paris.fr/api/records/1.0/search/?dataset=velib-disponibilite-en-temps-reel&rows=2000";



function createDescription(it,type) {
    switch(type) {
    case 'citybik':
        var desc = "<div class='popup'>";
        if (it.extra.has_ebikes === "true") {
            desc += "<span class='badge badge-pill badge-success'>e-Bikes</span>";
        }
        desc += "<hr></hr>";
        desc += "<p>Bikes: " + it.free_bikes + "</p>";
        if (it.extra.has_ebikes === "true") {
            desc += "<p>e-Bikes: " + it.extra.ebikes + "</p>";
        }
        desc += "<p>Empty slots: " + it.empty_slots + "</p></center></div>";
        break;
    case 'villeParis':
        var desc = "<div class='popup'>";
        desc += "<hr></hr>";
        desc += "<p>Bikes: " + it.fields.numbikesavailable + "</p>";
        desc += "<p>Empty slots: " + it.fields.numdocksavailable + "</p></center></div>";
        break;
    }
    return desc;
}

function createGEOJSON(data,type) {
    var geojson = {};
    geojson['type'] = 'FeatureCollection';
    geojson['features'] = [];
    switch(type){
    case 'citybik':
        for (var k in data) {
            var newFeature = {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [parseFloat(data[k].longitude), parseFloat(data[k].latitude)]
                },
                "properties": {
                    "title": data[k].name,
                    "description": createDescription(data[k],type),
                    "marker-color": "#332A6C",
                    "marker-size": "medium",
                    "stands": data[k].empty_slots,
                    "bikes": data[k].free_bikes,
                    "marker-symbol": data[k].free_bikes.toString()
                }
            };
            geojson['features'].push(newFeature);
        }    
        break;
    case 'villeParis':
        for (var k in data) {
            if (data[k].fields.hasOwnProperty('lon')) {
                newFeature = {
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [parseFloat(data[k].fields.lon), parseFloat(data[k].fields.lat)]
                    },
                    "properties": {
                        "title": data[k].fields.name,
                        "description": createDescription(data[k],type),
                        "marker-color": "#332A6C",
                        "marker-size": "medium",
                        "stands": data[k].fields.numdocksavailable,
                        "bikes": data[k].fields.numbikesavailable,
                        "marker-symbol": data[k].fields.numbikesavailable.toString()
                    }
                };
                geojson['features'].push(newFeature);
            }
        }
        break;
    }
    return geojson;
}

function createMap(geojson){
    var map = L.mapbox.map('map','mapbox.light', 'mapbox.streets', {attributionControl:true}).setView([48.8566, 2.3522],14);
    var bikes = L.mapbox.featureLayer();
    bikes.setGeoJSON(geojson).addTo(map);
    var isBikes = true;
    $(".map").hide();
    $('#clicker').click(function(){
        if (isBikes) {
            $.each(geojson['features'],function(i,it) {
                it.properties['marker-symbol'] = it.properties.stands.toString();
                it.properties['marker-color'] = "#974D39";
            });
            stands = L.mapbox.featureLayer(geojson);
            stands.addTo(map);
            map.removeLayer(bikes);
            isBikes = false;
        } else {
            map.removeLayer(stands);
            $.each(geojson['features'],function(i,it) {
                it.properties['marker-symbol'] = it.properties.bikes.toString();
                it.properties['marker-color'] = "#332A6C";
            });
            bikes = L.mapbox.featureLayer(geojson);
            bikes.addTo(map);
            isBikes = true;
        } 
    });
}

function createStats(data,type) {
    var nbOpenStations = 0,
        nbBikes = 0,
        nbStands = 0;
    switch(type) {
    case 'villeParis':
        for (var k in data) {
            if (data[k].fields.is_returning === 1) {
                nbOpenStations += 1,
                nbBikes += data[k].fields.numbikesavailable,
                nbStands += data[k].fields.numdocksavailable; 
            }
        }
        break;
    case 'citybik':
        break;
    }
    $("#nbOpenStations").text(nbOpenStations.toString());
    $("#nbBikes").text(nbBikes.toString());
    $("#nbStands").text(nbStands.toString());
    $("#stats").show();
}
// $.getJSON(url_citybike)
//     .done(function(data) {
//         var data = data.network.stations;
//         var geojson = createGEOJSON(data,'citybik');
//         createMap(geojson);
//     })
//     .fail(function() {
//         $.getJSON(url_villeParis)
//             .done(function(data){
//                 var data = data.records;
//                 var geojson = createGEOJSON(data,'villeParis');
//                 createMap(geojson);
//             })
//             .fail(function(){
//                 console.log('Unable to fetch data');
//             });
//     });
$.getJSON(url_villeParis)
    .done(function(data) {
        var data = data.records;
        var geojson = createGEOJSON(data,'villeParis');
        createStats(data,'villeParis');
        createMap(geojson);
        console.log('DATA FETCHED: VILLE DE PARIS');
    })
    .fail(function() {
        console.log('FETCHED FAILED ON VILLE DE PARIS');
        $.getJSON(url_citybike)
            .done(function(data){
                var data = data.network.stations;
                var geojson = createGEOJSON(data,'citybik');
                createMap(geojson);
            })
            .fail(function(){
                console.log('Unable to fetch data');
            });
    });

$("#switchmap").hide();
$("#closeMap").hide();
L.mapbox.accessToken = "pk.eyJ1IjoibG91aXNkZWNoYXJzb24iLCJhIjoiY2lubTF0dThvMDBhZHc5bTIxazN5YmI0MiJ9.kSOg1wJFUmNOWG6_vqEaoA";

$("#viewMap").click(function(){
    $(".mapBG").hide();
    $(".map").show();
    $("#switchmap").show();
    $("#closemap").show();
});

$("#closeMap").click(function(){
    $(".map").hide();
    $(".mapBG").show();
    $("#switchmap").hide();
    $("#closemap").hide();
});



