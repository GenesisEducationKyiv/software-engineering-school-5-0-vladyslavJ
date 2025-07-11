# SAD-001: Ports and Adapters Architecture

**Status:** Accepted  
**Date:** 2024-07-25  
**Author:** GitHub Copilot

## 1. Context

The Weather Forecast API requires a robust, scalable, and maintainable architecture. The system
needs to integrate with various external services (databases, caching systems, external weather
APIs, email services) and expose its functionality through a REST API and background jobs. To keep
the core business logic independent of these external technologies and to facilitate testing, a
clean separation of concerns is crucial.

## 2. Decision

We have chosen the **Ports and Adapters (Hexagonal) Architecture**. This pattern isolates the core
application logic (domain and application layers) from external concerns.

- **Ports** are interfaces that define how the application interacts with the outside world. There
  are two types:
  - **Input Ports (Driving Ports):** Define the API of the application's core logic (use cases).
    They are called by primary adapters.
  - **Output Ports (Driven Ports):** Define the requirements of the application for external
    services (e.g., database access, email sending). They are implemented by secondary adapters.
- **Adapters** are the glue between the ports and the external technologies.
  - **Primary Adapters (Driving Adapters):** Drive the application by calling the input ports (e.g.,
    REST controllers, scheduled jobs).
  - **Secondary Adapters (Driven Adapters):** Implement the output ports and are driven by the
    application (e.g., database repositories, external API clients).

This approach ensures that the core logic is pure and has no dependencies on specific technologies,
making it highly testable and easier to evolve.

## 3. Architecture Diagram

The following diagram illustrates the layers and dependencies in the application. Dependencies flow
from the outer layer (Infrastructure) to the inner layers (Application, Domain). The Domain layer
has no external dependencies.

```mermaid
graph TD
    subgraph "Infrastructure Layer (Adapters)"
        direction LR
        subgraph "Primary/Driving Adapters"
            A1[REST API Controllers<br>(WeatherController, SubscriptionController)]
            A2[Scheduled Jobs<br>(WeatherDigestJob)]
        end
        subgraph "Secondary/Driven Adapters"
            B1[PostgreSQL Repository<br>(SubscriptionRepository)]
            B2[Redis Cache<br>(WeatherCacheAdapter)]
            B3[External Weather Providers<br>(WeatherApiAdapter, OpenWeatherMapAdapter)]
            B4[Email Service<br>(EmailAdapter)]
        end
    end

    subgraph "Application Layer (Use Cases)"
        C1[GetWeatherUseCase]
        C2[SubscribeUseCase]
        C3[ConfirmSubscriptionUseCase]
        C4[UnsubscribeUseCase]
        C5[SendWeatherDigestUseCase]
    end

    subgraph "Domain Layer (Core Logic)"
        D1[Models<br>(Weather)]
        D2[Output Ports (Interfaces)<br>- ISubscriptionRepository<br>- IWeatherCachePort<br>- IWeatherProviderPort<br>- IEmailPort]
    end

    %% Dependencies
    A1 --> C1
    A1 --> C2
    A1 --> C3
    A1 --> C4
    A2 --> C5

    C1 --> D2
    C2 --> D2
    C3 --> D2
    C4 --> D2
    C5 --> D2

    C1 --> D1
    C5 --> D1

    B1 -.-> D2
    B2 -.-> D2
    B3 -.-> D2
    B4 -.-> D2

    classDef layer fill:#f9f9f9,stroke:#333,stroke-width:2px;
    class Infrastructure Layer (Adapters),Application Layer (Use Cases),Domain Layer (Core Logic) layer;

    linkStyle 0,1,2,3,4,9,10,11,12,13 stroke-width:2px,stroke:blue,fill:none;
    linkStyle 5,6,7,8 stroke-width:2px,stroke:green,fill:none;
    linkStyle 14,15,16,17 stroke-width:2px,stroke:red,fill:none,stroke-dasharray: 5 5;

    %% Style Notes
    %% Blue arrows: Primary Adapters call Application Use Cases
    %% Green arrows: Application Use Cases use Domain Models and Ports
    %% Red dashed arrows: Secondary Adapters implement Domain Ports
```

## 4. Layer Responsibilities

### 4.1. Domain Layer

- **Location:** `src/domain/`
- **Responsibility:** Contains the core business logic, entities, and rules of the application. It
  is completely independent of any external technology.
- **Key Components:**
  - **Models** ([`Weather`](src/domain/models/weather.model.ts)): Business objects with their own
    logic.
  - **Ports** ([`src/domain/ports/`](src/domain/ports/)): Interfaces defining contracts for data
    persistence
    ([`ISubscriptionRepository`](src/domain/ports/repositories/subscription-repository.port.ts)),
    caching ([`IWeatherCachePort`](src/domain/ports/cache/weather-cache.port.ts)), external data
    providers ([`IWeatherProviderPort`](src/domain/ports/providers/weather-provider.port.ts)), and
    notifications ([`IEmailPort`](src/domain/ports/notification/email.port.ts)).

### 4.2. Application Layer

- **Location:** `src/application/`
- **Responsibility:** Orchestrates the domain models to perform application-specific tasks (use
  cases). It defines the input ports for the application.
- **Key Components:**
  - **Input Ports** ([`IWeatherInputPort`](src/application/ports/weather.port.ts),
    [`ISubscriptionInputPort`](src/application/ports/subscription.port.ts)): Interfaces that define
    the application's capabilities.
  - **Use Cases** ([`src/application/use-cases/`](src/application/use-cases/)): Implementations of
    the input ports. They contain the logic for specific user stories, like
    [`GetWeatherUseCase`](src/application/use-cases/weather/get-weather.use-case.ts) or
    [`SubscribeUseCase`](src/application/use-cases/subscription/subscribe.use-case.ts). They depend
    on the domain's output ports to interact with external systems.

### 4.3. Infrastructure Layer

- **Location:** `src/infrastructure/`
- **Responsibility:** Contains all the external-facing components and technology-specific
  implementations (adapters). It adapts external requests to the application's input ports and
  implements the domain's output ports.
- **Key Components:**
  - **Primary Adapters:**
    - **API Controllers**
      ([`src/infrastructure/adapters/primary/api/controllers/`](src/infrastructure/adapters/primary/api/controllers/)):
      Handle HTTP requests, validate input, and call the appropriate use cases (input ports).
    - **Jobs**
      ([`WeatherDigestJob`](src/infrastructure/adapters/primary/jobs/weather-digest.job.ts)):
      Scheduled tasks that trigger use cases.
  - **Secondary Adapters:**
    - **Repositories**
      ([`SubscriptionRepository`](src/infrastructure/adapters/secondary/repositories/subscription.repository.ts)):
      Implements the `ISubscriptionRepository` port using TypeORM and PostgreSQL.
    - **Cache**
      ([`WeatherCacheAdapter`](src/infrastructure/adapters/secondary/cache/weather-cache.adapter.ts)):
      Implements the `IWeatherCachePort` using Redis.
    - **Weather Providers**
      ([`WeatherApiAdapter`](src/infrastructure/adapters/secondary/weather-providers/weather-api.adapter.ts)):
      Implements the `IWeatherProviderPort` by calling external weather APIs.
    - **Email** ([`EmailAdapter`](src/infrastructure/adapters/secondary/email/email.adapter.ts)):
      Implements the `IEmailPort` using Nodemailer.
  - **Configuration:**
    - **DI Container** ([`container.ts`](src/infrastructure/di/container.ts)): Wires all the
      components together using `tsyringe`.
    - **Server Setup** ([`app.ts`](src/app.ts), [`server.ts`](src/server.ts)): Express server
      configuration, middleware, and startup logic.

## 5. Consequences

- **High Testability:** The core logic (Domain and Application) can be tested
