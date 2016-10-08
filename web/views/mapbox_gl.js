// THIS SHOULD RENDER A BEAUTIFUL MAP BUT MARKERS ARE NOT VERY WELL
// SUPPORTED YET IN MABOX GL

mapboxgl.accessToken = 'pk.eyJ1IjoibG91aXNkZWNoYXJzb24iLCJhIjoiY2lubTF0dThvMDBhZHc5bTIxazN5YmI0MiJ9.kSOg1wJFUmNOWG6_vqEaoA';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v9',
    center: [2.3522, 48.8566],
    zoom: 14
});
map.on('load',function() {
    map.addSource('bikes',{
        type: 'geojson',
        data: !{geojson}
    });
    map.addLayer({
        "id":"bikes",
        "type":"symbol",
        "source":"bikes",
        "layout": {
            "text-field": "{bikes}",
            "icon-image": "marker-15",
            "icon-text-fit": "width",
            "icon-size": 3,
            "text-anchor": "center"
        }
    });
});
var button = document.createElement('button');
        document.body.appendChild(button);
        button.addEventListener('click',function() {
               var myGeojson = !{geojson};
               myGeojson['features'].forEach(function(it,ind) {
                        it.properties['marker-symbol'] = it.properties.stands.toString();
                        it.properties['marker-color'] = "#974D39";
               });
               map.getSource('bikes').setData(myGeojson);
        });
        
