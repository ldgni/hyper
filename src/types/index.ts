import type { EarlyAccessRequest, Link, User } from "@prisma/client";
import type { Session } from "next-auth";

// Database entity types
export type DbUser = User;
export type DbLink = Link;
export type DbEarlyAccessRequest = EarlyAccessRequest;

// API response types
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiError {
  error: string;
  details?: unknown;
}

// Component prop types
export interface LinkWithUser extends Link {
  user?: Pick<User, "id" | "name" | "email">;
}

export interface UserWithLinks extends User {
  links?: Link[];
}

// Form state types
export interface FormState<T = unknown> {
  type: "idle" | "loading" | "success" | "error";
  message?: string;
  data?: T;
}

// Session types - Use NextAuth's Session type directly
export type ExtendedSession = Session;

// Admin types
export interface AdminAccess {
  isAdmin: boolean;
  user: Pick<User, "id" | "isAdmin"> | null;
}

// Component loading states
export type LoadingState = Set<string>;

// Email template data
export interface EmailTemplateData {
  name: string;
  email: string;
  loginUrl: string;
}
