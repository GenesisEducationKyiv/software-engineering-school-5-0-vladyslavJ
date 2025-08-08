export type GrpcError = {
  code?: number;
  details?: string;
  message?: string;
  metadata?: unknown;
  getError?: () => {
    code?: number;
    details?: string;
    message?: string;
  };
};
