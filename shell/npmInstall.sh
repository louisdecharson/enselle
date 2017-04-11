#!/bin/bash

echo "mise à jour des fichiers (1/2)"
cd ../fetchers/
sudo npm install
cd ../web/
echo ${PWD}
sudo npm install
cd ../api/
sudo npm install
echo "Fin de la mise à jour des packages"

echo "Lancement des scripts (2/2)"
cd ../web/
echo ${PWD}
sudo pm2 describe server > /dev/null
RUNNING=$?
if [ "${RUNNING}" -ne 0 ]; then
  pm2 start server.js -n web
else
  pm2 restart server.js 
fi;

cd ../api/
echo ${PWD}
sudo pm2 describe server > /dev/null
RUNNING=$?
if [ "${RUNNING}" -ne 0 ]; then
  pm2 start server.js -n api
else
  pm2 restart server.js 
fi;

echo "Scripts relancés"
echo "Fin"
