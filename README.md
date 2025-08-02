# Weather Forecast API

A backend service with a minimal frontend, allowing users to subscribe for regular weather updates
(hourly or daily) by city. Built with TypeScript, Node.js, Nest.js, PostgreSQL, TypeORM, Redis.

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/vladyslavJ/genesis-se-school-5.git
```

```bash
cd genesis-se-school-5
```

### 2. Environment Variables

You need to configure two main environment files **.env.docker** and **.env.test.docker** (for
integration/E2E tests). Copy the provided examples and fill out required fields:

```bash
cp .env.docker.example .env.docker
```

```bash
cp .env.test.docker.example .env.test.docker
```

**How to fill:**

- `WEATHER_API_KEY`: [Get your API key here](https://www.weatherapi.com/).
- `MAIL_USER`/`MAIL_PASS`: Use Gmail and
  [set up an App Password](https://support.google.com/accounts/answer/185833).
- `APP_BASE_URL`: Public URL of your backend (for local: `http://localhost:3000`).

### 3. Run the project in Docker

Start services:

```bash
npm run start:all
```

Stop services:

```bash
npm run stop:all
```

- The api container uses Dockerfile.dev, mounts your code, and restarts the server every time after
  changes.

- This starts 3 services: **api**, **db** (Postgres), and **redis**.
- All dependencies and database migrations will run automatically.

## 📝 Project Logic & Microservices Architecture

### Main Services:

- **api-gateway** — routes all external requests to the appropriate microservices (subscription,
  weather, notification, email).
- **subscription** — manages user subscriptions, depends on weather (for weather data) and
  notification (for alerting users).
- **weather** — provides weather data to subscription and notification, fetches data from
  [weatherapi.com](https://www.weatherapi.com/) and caches it in Redis.
- **notification** — responsible for sending notifications to users, uses email for delivery, and
  cron for sending digests (hourly/daily). Triggered by subscription to alert users.
- **email** — sends email notifications, triggered by the notification service.

### Service Relationships:

- **api-gateway** → (routes) → **subscription**, **weather**, **notification**, **email**
- **subscription** → (fetches data) → **weather**
- **subscription** → (triggers) → **notification**
- **notification** → (sends email) → **email**
- **notification** → (fetches data) → **weather**
- **notification** → (cron) → (sends digests)

### Subscription Flow:

1. User submits email, city, and update frequency via the frontend (api-gateway).
2. **subscription** creates the subscription and fetches weather data from **weather**.
3. **notification** sends a confirmation email via **email**.
4. After confirmation, **notification** (via cron) sends weather digests (data from **weather**) via
   **email**.
5. Each digest contains a weather report and an unsubscribe link.

### Additional Notes:

- All services log events and errors to their respective files.

## 🛠️ Technologies Used

- **TypeScript, Node.js, Nest.js**
- **PostgreSQL** with **TypeORM** (migrations auto-run)
- **Redis** for caching weather data
- **Nodemailer** for email notifications
- **Docker Compose** for easy local/production deployment

## 📂 File/Folder Structure

- `apps/` — main microservices:
  - `api-gateway/` — entry point for all external requests
  - `subscription/` — user subscription management
  - `weather/` — weather data provider
  - `notification/` — notification and digest delivery
  - `email/` — email delivery service
- `libs/` — shared libraries and modules:
  - `common/` — DTOs, enums, interfaces, models, DI tokens, utilities, types, scripts
    - `di/` — dependency injection tokens for microservices
    - `dtos/` — shared data transfer objects
    - `enums/` — shared enums
    - `interfaces/` — shared interfaces
    - `models/` — shared models/entities
    - `types/` — shared types
    - `utils/` — shared utility functions and helpers
    - `scripts/` — scripts for migrations, healthchecks, starting/stopping services, etc.
  - `config/` — centralized configuration (e.g., `configuration.ts`)
  - `modules/` — additional modules (e.g., `logger/`, `metrics/`)
  - `proto/` — gRPC proto files for inter-service communication
- `docs/` — documentation, system design, ADRs
- `logs/` — all runtime logs are stored here (created at runtime)

- `docker-compose.yml`, `Dockerfile`, `Dockerfile.dev` — for containerization

## 📊 Monitoring & Observability

- **Prometheus** is used to collect application metrics, including weather cache statistics.
- **Grafana** is used for visualization and alerting based on these metrics.

### Weather Cache Metrics (Redis)

The following metrics are exposed for weather data caching:

- `redis_cache_hit_total`: Total number of cache hits (requested key found in Redis)
- `redis_cache_miss_total`: Total number of cache misses (requested key not found)
- `redis_cache_error_total`: Total number of cache operation errors (get/set/del)
- `redis_cache_set_total`: Total number of successful cache set/update operations

These metrics can be visualized in Grafana dashboards and used to set up alerts (see
`docs/observability/alerting-policy.md`).

## ℹ️ Notes

- **First launch:** All database migrations are run automatically, and the API will be available at
  the specified port.
- **SMTP connection:** The server performs a healthcheck for the mail service and will auto-restart
  if connection fails.
- **For production:** Set secure and unique values for all secrets.
