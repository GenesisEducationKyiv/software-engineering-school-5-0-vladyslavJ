# Log Retention Policy

## Overview

This document describes the log retention policy for the application, specifying how long different
types of logs are stored, when and how they are deleted or archived, and the rationale behind these
decisions.

## Log Types and Retention Periods

### Error Logs

- **Retention:** 90 days
- **Rationale:** Error logs are critical for incident investigation, compliance, and post-mortem
  analysis. Retaining them for 3 months ensures enough time to analyze and resolve issues, including
  those discovered late.

### Warn Logs

- **Retention:** 30 days
- **Rationale:** Warning logs help identify potential problems before they become critical. One
  month is sufficient for trend analysis and proactive maintenance.

### Info Logs (Sampled)

- **Retention:** 14 days
- **Rationale:** Info logs are sampled (~30%) to reduce volume. They are useful for auditing and
  operational monitoring, but do not require long-term storage. Two weeks balances usefulness and
  storage cost.

### Debug Logs

- **Retention:** 7 days
- **Rationale:** Debug logs are mainly used for short-term troubleshooting and are only enabled in
  specific environments. One week is enough for most debugging sessions.

## Deletion and Archiving

- **Automatic Deletion:** Logs older than their retention period are automatically deleted by
  scheduled jobs (e.g., daily cleanup scripts or log management tools).
- **Archiving:** Error logs older than 90 days may be archived to cold storage (e.g., cloud object
  storage) if required by compliance or business needs. Other log types are not archived due to
  lower value and higher volume.

## Rationale

The retention periods are chosen to balance:

- **Incident response and compliance needs** (longer for error logs)
- **Storage cost and performance** (shorter for info/debug logs, sampling for info)
- **Operational usefulness** (enough time for trend analysis and troubleshooting)