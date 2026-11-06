#!/usr/bin/env bash
set -e

if ! sudo swapon --show | grep -q '/swapfile'; then
  echo ">> Creando swap de 2 GB"
  sudo fallocate -l 2G /swapfile
  sudo chmod 600 /swapfile
  sudo mkswap /swapfile
  sudo swapon /swapfile
  echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab > /dev/null
fi

echo ">> Instalando Docker"
sudo apt-get update -y
if ! sudo apt-get install -y docker.io docker-compose-v2 git; then
  echo ">> El paquete de Ubuntu falló; usando el instalador oficial de Docker"
  curl -fsSL https://get.docker.com | sudo sh
fi
sudo systemctl enable --now docker

echo ""
echo ">> Listo. Versiones instaladas:"
sudo docker --version
sudo docker compose version
echo ""
echo "Siguiente paso:"
echo "  sudo docker compose -f deploy/docker-compose.yml up -d --build"
