# Weather Forecast API

A backend service with a minimal frontend, allowing users to subscribe for regular weather updates (hourly or daily) by city. Built with TypeScript, Node.js, Express, PostgreSQL, TypeORM, Redis, and features Swagger UI for API documentation and testing.

## 🚀 Quick Start

### 1. Clone the repository

```
git clone https://github.com/vladyslavJ/genesis-se-school-5.git
```
```
cd genesis-se-school-5
```

### 2. Environment Variables

You need to configure two main environment files **.env.docker** and **.env.test.docker** (for integration/E2E tests). Copy the provided examples and fill out required fields:

```
cp .env.docker.example .env.docker
```
```
cp .env.test.docker.example .env.test.docker
```

**How to fill:**

-   `WEATHER_API_KEY`: [Get your API key here](https://www.weatherapi.com/).
-   `MAIL_USER`/`MAIL_PASS`: Use Gmail and [set up an App Password](https://support.google.com/accounts/answer/185833).
-   `APP_BASE_URL`: Public URL of your backend (for local: `http://localhost:3000`).

### 3. Run the project in Docker

```
docker-compose up --build
```

-   This starts 3 services: **api**, **db** (Postgres), and **redis**.
-   All dependencies and database migrations will run automatically.

### 4. Open in browser

-   **Frontend (subscription form):** [http://localhost:3000/](http://localhost:3000/)
-   **Swagger UI (API docs & testing):** [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

### 5. Run tests

```
docker-compose --profile test up api-test
```

-   Runs integration and end-to-end tests inside a Docker container.

## 📝 Project Logic

-   **REST API** for subscribing to weather updates, confirming subscription, unsubscribing, and getting current weather.
-   **Frontend**: A minimal HTML page (`public/html/index.html`) for users to subscribe with their email, city, and update frequency.
-   **Subscription Flow**:

    -   User submits email, city, and frequency.
    -   Receives a confirmation email (with a styled template and a confirmation link).
    -   After confirmation, receives weather digests at the chosen frequency.
    -   Each digest contains a styled weather report and an unsubscribe link.

-   **Weather data** is fetched from [weatherapi.com](https://www.weatherapi.com/) and cached in Redis.
-   **Emails** are sent via SMTP (Gmail by default), using styled HTML templates for better user experience.
-   **Background jobs** with cron:

    -   Send hourly and daily digests to all confirmed subscribers.

-   **Logs**:

    -   All events and errors are logged both to the console and to files in the `logs/` directory.

-   **API documentation** is available via Swagger UI.

## 🛠️ Technologies Used

-   **TypeScript, Node.js, Express**
-   **PostgreSQL** with **TypeORM** (migrations auto-run)
-   **Redis** for caching weather data
-   **Nodemailer** for email notifications
-   **Swagger UI** for interactive API documentation and testing
-   **Jest** and **Supertest** for testing
-   **Docker Compose** for easy local/production deployment

## 📂 File/Folder Structure

-   `src/` — main source code (controllers, services, models, routes, etc.)
-   `public/` — static frontend files (HTML, CSS, JS)
-   `logs/` — all runtime logs are stored here
-   `docker-compose.yml`, `Dockerfile` — for containerization

## ℹ️ Notes

-   **First launch:** All database migrations are run automatically, and the API will be available at the specified port.
-   **SMTP connection:** The server performs a healthcheck for the mail service and will auto-restart if connection fails.
-   **For production:** Set secure and unique values for all secrets.

![CI/CD](https://github.com/<USER>/<REPO>/actions/workflows/ci.yml/badge.svg)
