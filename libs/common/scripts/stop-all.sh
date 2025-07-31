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

echo "Stopping RabbitMQ infrastructure..."
docker-compose -f "docker-compose.rabbitmq.yml" down

echo "All services stopped."
