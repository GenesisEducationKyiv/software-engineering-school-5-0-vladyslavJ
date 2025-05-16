# README

This document explains how to run the Weather API in Docker containers using Docker Compose.

## Prerequisites

-   Docker and Docker Compose installed
-   The project contains a `Dockerfile` and `docker-compose.yml` in the root directory

## 1. Environment Configuration (.env)

In the project root, create a file named `.env` with the following variables:

```ini
PORT=3000

WEATHER_API_KEY=your_weatherapi_key
WEATHER_BASE_URL=https://api.weatherapi.com/v1

DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=db
DB_NAME=WeatherAPI
DB_PORT=5432

MAIL_HOST=smtp.gmail.com
MAIL_PORT=465
MAIL_SECURE=true
MAIL_USER=your_email_username
MAIL_PASS=your_email_password
MAIL_FROM=Weather API <no-reply@weatherapi.app>

APP_BASE_URL=http://localhost:3000

REDIS_HOST=redis
REDIS_PORT=6379
REDIS_TTL=300
```

## 2. Build and Start Services

From the project root, run:

```bash
docker-compose up --build -d
```

## 3. Verify the Setup

1. **Check API logs**

    ```bash
    docker-compose logs -f api
    ```

    Confirm that migrations ran successfully and the server started without errors.

2. **Test Endpoints (Postman or curl)**

    - GET `http://localhost:3000/api/weather?city=Kyiv`
    - POST `http://localhost:3000/api/subscribe`

        ```json
        {
        	"email": "test@example.com",
        	"city": "Kyiv",
        	"frequency": "daily"
        }
        ```

    - GET `http://localhost:3000/api/confirm/<token>`
    - GET `http://localhost:3000/api/unsubscribe/<token>`

## 4. Shutdown and Cleanup

To stop and remove all containers, networks, and volumes:

```bash
docker-compose down
```
