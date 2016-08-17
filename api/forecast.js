// Packages
var request = require('request');
var fs = require('fs');


var apiKey = "078fb4a74207a5b2c93e6756015addd7";
var url = "https://api.forecast.io/forecast/"+apiKey+"/";

var coord1001=[48.8570916352, 2.34174799516];

function writeJSON(urlAPI,pos){
    urlAPI=urlAPI+String(pos[0])+","+String(pos[1]);
    request(urlAPI,function(error,res,body){
        if(!error && res.statusCode == 200) {
            var myjson0 = JSON.parse(body)['hourly']['data'];
            var myjson = {};
            myjson['lastModified'] =  Math.round(new Date().getTime()/1000);
            myjson['data']=myjson0;
            myjson=JSON.stringify(myjson);
            fs.writeFile("fcst.json",myjson,function(err) {
                if (err) {
                    console.log(err);
                };
            });
        }
        else {
            console.log("error in request");
            console.log("url: "+urlAPI);
        };
    });
}

writeJSON(url,coord1001);

fs.readFile("fcst.json",'utf-8',function(err,data){
    if (err) {
        console.log(err);
    }
});

