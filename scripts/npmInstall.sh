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
sudo pm2 restart server.js
cd ../api
sudo pm2 restart server.js
echo "Scripts relancés"
echo "Fin"
