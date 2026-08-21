/**
 * Generic API response envelope
 * Always includes success flag, data (or null on error), and error message (or null on success)
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: string | null;
}

/**
 * HTTP error object structure from Axios
 */
export interface HttpErrorDetails {
  status?: number;
  message: string;
  code?: string;
}
