export enum GrpcCode {
  OK = 0, // HTTP 200 OK
  CANCELLED = 1, // HTTP 499 Client Closed Request
  UNKNOWN = 2, // HTTP 500 Internal Server Error
  INVALID_ARGUMENT = 3, // HTTP 400 Bad Request
  DEADLINE_EXCEEDED = 4, // HTTP 504 Gateway Timeout
  NOT_FOUND = 5, // HTTP 404 Not Found
  ALREADY_EXISTS = 6, // HTTP 409 Conflict
  FORBIDDEN = 7, // HTTP 403 Forbidden
  RESOURCE_EXHAUSTED = 8, // HTTP 429 Too Many Requests
  BAD_REQUEST = 9, // HTTP 400 Bad Request
  ABORTED = 10, // HTTP 409 Conflict
  OUT_OF_RANGE = 11, // HTTP 400 Bad Request
  UNIMPLEMENTED = 12, // HTTP 501 Not Implemented
  INTERNAL_SERVER_ERROR = 13, // HTTP 500 Internal Server Error
  SERVICE_UNAVAILABLE = 14, // HTTP 503 Service Unavailable
  DATA_LOSS = 15, // HTTP 500 Internal Server Error
  UNAUTHENTICATED = 16, // HTTP 401 Unauthorized
}
