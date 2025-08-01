# Alerting Policy

## Overview

This document describes the alerting policy for the application, based on implemented logging (info,
warn, error, debug levels), metrics, and log sampling. The goal is to ensure timely detection of
issues and maintain high service reliability.

## Alert Types

### 1. Error Rate Alerts

- **Trigger:** High rate of `error` level logs within a short period (e.g., more than 5 errors per
  minute).
- **Reason:** Indicates possible service malfunction or critical failures.
- **Importance:** Immediate attention required to prevent downtime or data loss.

### 2. Warning Rate Alerts

- **Trigger:** Sudden spike in `warn` level logs (e.g., more than 20 warnings in 10 minutes).
- **Reason:** May signal degraded performance, potential issues, or misconfigurations.
- **Importance:** Early warning to investigate before escalation to errors.

### 3. Service Health Metrics

- **Trigger:** Key metrics (e.g., request latency, error rate, CPU/memory usage) exceed defined
  thresholds.
- **Reason:** Metrics provide quantitative insight into service health and performance.
- **Importance:** Proactive detection of performance bottlenecks or resource exhaustion.

### 4. Log Sampling Anomalies

- **Trigger:** Unusual patterns detected in sampled logs (e.g., rare errors or unexpected debug
  messages).
- **Reason:** Sampling helps catch infrequent but critical issues without overwhelming the system.
- **Importance:** Ensures rare but important events are not missed.

### 5. Unavailability or Downtime

- **Trigger:** No logs or metrics received from a service for a defined period (e.g., 5 minutes).
- **Reason:** May indicate a crash, network partition, or infrastructure failure.
- **Importance:** Immediate action required to restore service.

## Rationale

These alerts are chosen to balance between noise and actionable signals. Error and warning log
alerts provide direct insight into application issues, while metrics-based alerts cover performance
and resource health. Log sampling ensures that even with reduced log volume, critical anomalies are
still detected. This layered approach helps maintain reliability and quick incident response.
