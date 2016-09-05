#!/bin/bash

echo "mise à jour des fichiers (1/2)"
cd fetchers/
npm install
cd ../web
npm install
cd ../api
npm install
echo "Fin de la mise à jour des packages"


cd ../web
sudo pm2 describe server.js > /dev/null
RUNNING=$?
if [ "${RUNNING}" -ne 0 ]; then
  sudo pm2 start server.js
else
  sudo pm2 restart server.js 
fi;

cd ../api
sudo pm2 describe server.js > /dev/null
RUNNING=$?
if [ "${RUNNING}" -ne 0 ]; then
  sudo pm2 start server.js
else
  sudo pm2 restart server.js 
fi;

echo "Scripts relancés"
echo "Fin"
