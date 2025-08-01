# Log Retention Policy

## Overview

This policy defines how long different types of logs are retained, and the procedures for log
deletion and archiving. The policy is designed to balance operational needs, compliance, and storage
efficiency, considering the use of log levels and sampling.

## Retention Periods

- **Error Logs:** Retain for 90 days.
  - _Reason:_ Error logs are critical for incident investigation and post-mortem analysis.
- **Warning Logs:** Retain for 30 days.
  - _Reason:_ Useful for trend analysis and early detection of recurring issues.
- **Info Logs:** Retain for 14 days (sampled if high volume).
  - _Reason:_ Provide operational context; sampling reduces storage while preserving insight.
- **Debug Logs:** Retain for 7 days (sampled aggressively).
  - _Reason:_ Mainly used for troubleshooting; short retention and sampling minimize storage impact.

## Log Deletion and Archiving

- **Automatic Deletion:** Logs older than their retention period are automatically deleted.
- **Archiving:** Critical error logs (e.g., related to security or compliance) may be archived to
  secure storage for up to 1 year.
- **Sampling:** For high-volume logs (info/debug), only a representative subset is stored, based on
  defined sampling rules.

## Rationale

Longer retention for error logs ensures sufficient time for investigation and compliance. Shorter
retention and sampling for less critical logs optimize storage and reduce costs. Archiving is
reserved for logs with legal or audit requirements. This approach maintains operational visibility
while ensuring efficient resource usage.
