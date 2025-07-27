# ADR-007: Microservice Boundaries

Status: Proposed  
Date: 27-07-2025  
Author: Zhukov Vladyslav

## Context

To achieve modularity, scalability, and independent team development, our system is split into
distinct microservices, each with clear functional and technical boundaries. Every microservice owns
its domain logic, data storage, and external dependencies. Inter-service communication is strictly
via public APIs (gRPC or REST), with no shared databases or hidden coupling. Shared code is limited
to common libraries only.

### Weather Service

- **Domain**: Responsible for fetching, caching, and providing current weather data from
  third-party providers.
- **Dependencies**:
  - External weather APIs (e.g., WeatherAPI.com, OpenWeatherMap.org)
  - Redis for caching weather responses
- **Persistence**: No direct database, uses Redis as a cache only

### Subscription Service

- **Domain**: Manages user subscriptions, confirmation tokens, and unsubscriptions.
  Handles all persistence of subscription data.
- **Dependencies**:
  - PostgreSQL for persistent storage
- **Persistence**: Owns and manages its PostgreSQL schema

### Notification Service

- **Domain**: Schedules and sends email notifications to users based on their
  subscriptions and weather updates.
- **Dependencies**:
  - Cron jobs for scheduling
  - Calls Subscription, Weather, and Email services via gRPC
- **Persistence**: Stateless; relies on other services for data

### Email Service

- **Domain**: Handles all email delivery, template management, and retry logic for failed
  emails.
- **Dependencies**:
  - Nodemailer for SMTP email delivery
- **Persistence**: Stateless; manages templates in code or configuration

### API Gateway

- **Domain**: Exposes the public REST API, handles authentication, and routes requests to
  internal microservices.
- **REST endpoints**: 
  - `POST /subscribe`
  - `POST /confirm`
  - `POST /unsubscribe`
  - `GET /weather`
- **Dependencies**:
  - Forwards requests to internal gRPC APIs of other services
- **Persistence**: Stateless; does not own data

## Boundary Rules

- Each microservice owns its own data storage (database or cache); no direct access to another
  service's persistence layer.
- All inter-service communication is via public APIs (gRPC or REST). No direct function calls or
  imports between services, except for shared libraries in `libs/common`.
- No shared database schemas or tables. Data duplication is allowed if needed for autonomy.
- Shared code (DTOs, enums, interfaces) is maintained in the `libs/common` package and versioned
  appropriately.
- Service boundaries are enforced both at the code and infrastructure level (e.g., separate Docker
  containers, network policies).

## Rationale

Clear boundaries enable independent deployment, scaling, and development of each service. This
reduces coupling, improves maintainability, and allows teams to work autonomously. Strict API-based
communication and isolated persistence ensure that changes in one service do not unintentionally
impact others.
