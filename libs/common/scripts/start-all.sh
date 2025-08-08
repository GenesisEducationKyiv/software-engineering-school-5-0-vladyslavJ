#!/bin/bash
set -e

SERVICES=(
  subscription
  email
  notification
  weather
  api-gateway
)

echo "Ensuring shared Docker network exists..."
docker network inspect backend-net >/dev/null 2>&1 || docker network create backend-net

echo "Starting RabbitMQ infrastructure..."
docker-compose -f "docker-compose.rabbitmq.yml" up -d --build

echo "Starting Prometheus & Grafana infrastructure..."
docker-compose -f "docker-compose.monitoring.yml" up -d --build

for SERVICE in "${SERVICES[@]}"; do
  echo "Starting $SERVICE..."
  docker-compose -f "apps/$SERVICE/docker-compose.yml" up -d --build
done

echo "All services started successfully."
