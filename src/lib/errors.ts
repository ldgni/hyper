import { NextResponse } from "next/server";
import { ZodError } from "zod";

import type { ApiError, ApiResponse } from "@/types";

// API error response builder
export function createErrorResponse(
  error: string,
  status: number = 500,
  details?: unknown,
): NextResponse<ApiError> {
  const response: ApiError = { error };
  if (details) {
    response.details = details;
  }

  return NextResponse.json(response, { status });
}

// API success response builder
export function createSuccessResponse<T>(
  data: T,
  message?: string,
  status: number = 200,
): NextResponse<ApiResponse<T>> {
  const response: ApiResponse<T> = { data };
  if (message) {
    response.message = message;
  }

  return NextResponse.json(response, { status });
}

// Handle API errors consistently
export function handleApiError(error: unknown): NextResponse<ApiError> {
  console.error("API Error:", error);

  if (error instanceof ZodError) {
    return createErrorResponse("Invalid request data", 400, error.issues);
  }

  if (error instanceof Error) {
    // Known error types
    switch (error.message) {
      case "Admin access required":
        return createErrorResponse("Access denied", 403);
      case "Unauthorized":
        return createErrorResponse("Authentication required", 401);
      default:
        return createErrorResponse(error.message, 500);
    }
  }

  return createErrorResponse("Internal server error", 500);
}

// Client-side error handler
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  return "An unexpected error occurred";
}

// Async error wrapper
export async function withErrorHandling<T>(
  fn: () => Promise<T>,
): Promise<[T | null, Error | null]> {
  try {
    const result = await fn();
    return [result, null];
  } catch (error) {
    return [null, error instanceof Error ? error : new Error(String(error))];
  }
}
