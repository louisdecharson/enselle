#!/bin/bash

echo "upgrading packages"
sudo apt-get update        # Fetches the list of available updates
sudo apt-get upgrade       # Strictly upgrades the current packages
sudo apt-get dist-upgrade  # Installs updates (new ones)
sudo apt-get autoremove
echo "Fin"
