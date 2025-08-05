# Alerting Policy

## 1. Alerts Based on Logging

### Error-level

- **Description:** Detection of `error` level entries in logs.
- **Alert:** If the number of errors within a certain period exceeds a threshold (e.g., >5 in 5
  minutes).
- **Why important:** Indicates critical failures in the service that require immediate attention.

### Warn-level

- **Description:** Detection of `warn` level entries.
- **Alert:** If the number of warnings increases abnormally.
- **Why important:** May signal potential issues that have not yet caused failures.

### Debug-level

- **Description:** Used for detailed analysis, but not a trigger for alerts in production.
- **Alert:** Not configured, but can be useful for incident investigation.

### Info-level

- **Description:** Reflects major events (service start, successful operations). For `info` level,
  log sampling is implemented: only about 30% of info logs are actually written, to reduce log
  volume and storage costs.
- **Alert:** Not configured, used for audit purposes. Sampling should be considered when analyzing
  info-level logs, as not all events are logged.

## 2. Alerts Based on Metrics

### 2.1. Cache Metrics (Redis)

- **redis_cache_error_total**  
  **Alert:** >0 in 5 minutes  
  **Why important:** Cache errors can lead to performance degradation or data loss.

- **redis_cache_miss_total**  
  **Alert:** Sharp increase in cache misses  
  **Why important:** May indicate issues with cache population or changes in usage patterns.

- **redis_cache_hit_total**  
  **Alert:** Decrease in cache hits  
  **Why important:** Indicates inefficient cache operation.

- **redis_cache_set_total**  
  **Alert:** Abnormally low number of cache set operations  
  **Why important:** May indicate problems with data updates.

### 2.2. General Service Metrics

- **HTTP/gRPC error rate (Counter/Histogram):**  
  **Alert:** >5% errors of total requests  
  **Why important:** Indicates issues in API operation.

- **Latency (Histogram/Summary):**  
  **Alert:** Exceeding latency threshold (e.g., 95th percentile >1 sec)  
  **Why important:** Indicates performance degradation.

- **Service availability (Gauge):**  
  **Alert:** Service unavailable for >1 minute  
  **Why important:** Indicates downtime.

## 3. Argumentation

- **Logging** allows for quick identification of the cause and impact of incidents.
- **Metrics** enable automatic response to anomalies in service operation, increasing stability and
  reliability.
- **Alerts** for critical errors, cache and performance degradation are essential for maintaining
  SLA and rapid incident response.
