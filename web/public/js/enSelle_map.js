const url = "https://api.citybik.es/v2/networks/velib";

function createDescription(it) {

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
    return desc;
}
$("#switchmap").hide();
$("#closeMap").hide();
L.mapbox.accessToken = "pk.eyJ1IjoibG91aXNkZWNoYXJzb24iLCJhIjoiY2lubTF0dThvMDBhZHc5bTIxazN5YmI0MiJ9.kSOg1wJFUmNOWG6_vqEaoA";
$.getJSON(url,function(data) {
    var geojson = {};
    geojson['type'] = 'FeatureCollection';
    geojson['features'] = [];
    var data = data.network.stations;
    for (var k in data) {
        var newFeature = {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [parseFloat(data[k].longitude), parseFloat(data[k].latitude)]
            },
            "properties": {
                "title": data[k].name,
                "description": createDescription(data[k]),
                "marker-color": "#332A6C",
                "marker-size": "medium",
                "stands": data[k].empty_slots,
                "bikes": data[k].free_bikes,
                "marker-symbol": data[k].free_bikes.toString()
            }
        };
        geojson['features'].push(newFeature);
    }    
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
});

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



