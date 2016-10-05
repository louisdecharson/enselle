#!/bin/bash

echo "mise à jour des fichiers (1/2)"
cd fetchers/
sudo npm install
cd ../web
sudo npm install
cd ../api
sudo npm install
echo "Fin de la mise à jour des packages"


cd ../web
sudo pm2 describe server > /dev/null
RUNNING=$?
if [ "${RUNNING}" -ne 0 ]; then
  pm2 start server.js
else
  pm2 restart server.js 
fi;

cd ../api
sudo pm2 describe server > /dev/null
RUNNING=$?
if [ "${RUNNING}" -ne 0 ]; then
  pm2 start server.js
else
  pm2 restart server.js 
fi;

echo "Scripts relancés"
echo "Fin"
