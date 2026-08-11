import type { FetchError } from "ofetch";
import type { ApiError } from "~/types/api";

export function normalizeApiError(error: unknown): ApiError {
  const fetchError = error as FetchError<{
    detail?: unknown;
  }>;

  const status = fetchError.response?.status ?? 500;
  const detail = fetchError.data?.detail;

  if (typeof detail === "string") {
    return {
      status,
      message: detail,
    };
  }

  if (Array.isArray(detail)) {
    return {
      status,
      message: "The submitted data is invalid.",
      details: detail,
    };
  }

  return {
    status,
    message: fetchError.message || "Something went wrong.",
    details: detail,
  };
}
