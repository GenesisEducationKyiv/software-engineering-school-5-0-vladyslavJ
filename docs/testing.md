# Testing Guide

This document explains how to run **unit** and **integration** tests in Docker.

## Requirements

- Node.js ≥ 18 (for local runs)
- Docker & Docker Compose v2 (for Docker runs)

## Description

This project uses separate Docker containers for testing. Each command below launches the
corresponding container with an isolated test environment, independent from the main application.  
The `test` profile in Docker Compose ensures that only the services required for testing are
started.

## 1. Unit Tests

```bash
docker compose --profile test run --rm tests-unit
```

**What this command does:**  
Starts the `tests-unit` container, which contains the environment for running unit tests. The
container is created only for the test run and is removed after completion (`--rm`).  
The `test` profile ensures that only the necessary services for testing are started.

## 2. Integration Tests

```bash
docker compose --profile test run --rm tests-int
```

**What this command does:**  
Starts the `tests-int` container, which contains the environment for running integration tests. This
container is also temporary and is removed after the tests finish.  
The `test` profile ensures that only the required services for integration testing (such as
databases or dependencies)
