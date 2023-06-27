#!/usr/bin/env bash

set -ue pipefail

## docker push で必要な情報を入力から読み取ります
read -rp "Please enter your docker registry username: " registry_username
read -rsp "Please enter your docker registry password: " registry_password

cd "$(dirname "$0")"

cd api
docker build -t "quay.io/$registry_username/bootcamp-scaffold-api:latest" .

cd ../webapp
docker build -t "quay.io/$registry_username/bootcamp-scaffold-webapp:latest" .

echo "$registry_password" | docker login --username="$registry_username" --password-stdin quay.io

docker push "quay.io/$registry_username/bootcamp-scaffold-api:latest"
docker push "quay.io/$registry_username/bootcamp-scaffold-webapp:latest"
