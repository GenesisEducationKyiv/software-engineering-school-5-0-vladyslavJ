#!/bin/bash
set -e

SERVICES=(
  api-gateway
  weather
  notification
  email
  subscription
)

for SERVICE in "${SERVICES[@]}"; do
  echo "Stopping $SERVICE..."
  docker-compose -f "apps/$SERVICE/docker-compose.yml" down
done

echo "All services stopped."
