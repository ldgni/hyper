import { z } from "zod";

import { DB_LIMITS } from "./constants";

// User validation
export const userSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(
      DB_LIMITS.USER_NAME_MAX_LENGTH,
      `Name must be less than ${DB_LIMITS.USER_NAME_MAX_LENGTH} characters`,
    ),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Invalid email address")
    .toLowerCase(),
});

// Link validation
export const linkSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(
      DB_LIMITS.LINK_TITLE_MAX_LENGTH,
      `Title must be less than ${DB_LIMITS.LINK_TITLE_MAX_LENGTH} characters`,
    ),
  url: z
    .string()
    .trim()
    .min(1, "URL is required")
    .url("Invalid URL format")
    .max(
      DB_LIMITS.LINK_URL_MAX_LENGTH,
      `URL must be less than ${DB_LIMITS.LINK_URL_MAX_LENGTH} characters`,
    ),
});

// Early access validation
export const earlyAccessSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(
      DB_LIMITS.USER_NAME_MAX_LENGTH,
      `Name must be less than ${DB_LIMITS.USER_NAME_MAX_LENGTH} characters`,
    ),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Invalid email address")
    .toLowerCase(),
  message: z
    .string()
    .trim()
    .min(1, "Message is required")
    .min(
      DB_LIMITS.EARLY_ACCESS_MESSAGE_MIN_LENGTH,
      `Message must be at least ${DB_LIMITS.EARLY_ACCESS_MESSAGE_MIN_LENGTH} characters`,
    )
    .max(
      DB_LIMITS.EARLY_ACCESS_MESSAGE_MAX_LENGTH,
      `Message must be less than ${DB_LIMITS.EARLY_ACCESS_MESSAGE_MAX_LENGTH} characters`,
    ),
});

// Admin validation
export const approvalSchema = z.object({
  approved: z.boolean(),
});

// Login validation
export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Invalid email address")
    .toLowerCase(),
});

// Export types
export type User = z.infer<typeof userSchema>;
export type Link = z.infer<typeof linkSchema>;
export type EarlyAccess = z.infer<typeof earlyAccessSchema>;
export type LoginData = z.infer<typeof loginSchema>;
