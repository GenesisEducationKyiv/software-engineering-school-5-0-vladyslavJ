#!/bin/bash

set -e

SERVICES=(
  subscription
  email
  notification
  weather
  api-gateway
)

echo "🌐 Ensure shared Docker network exists..."
docker network inspect backend-net >/dev/null 2>&1 || docker network create backend-net

for SERVICE in "${SERVICES[@]}"; do
  echo "Starting $SERVICE..."
  docker-compose -f "apps/$SERVICE/docker-compose.yml" up -d --build
done

echo "All services are up"
