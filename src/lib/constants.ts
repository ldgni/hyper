// App configuration
export const APP_CONFIG = {
  name: "Hyper",
  description: "Save and organize your links",
  url: process.env.NEXTAUTH_URL || "http://localhost:3000",
} as const;

// Database limits
export const DB_LIMITS = {
  LINK_TITLE_MAX_LENGTH: 200,
  LINK_URL_MAX_LENGTH: 2000,
  USER_NAME_MAX_LENGTH: 100,
  EARLY_ACCESS_MESSAGE_MIN_LENGTH: 10,
  EARLY_ACCESS_MESSAGE_MAX_LENGTH: 500,
} as const;

// UI constants
export const UI_CONFIG = {
  COPY_FEEDBACK_DURATION: 3000,
  TOAST_DURATION: 5000,
  DEBOUNCE_DELAY: 300,
} as const;

// API routes
export const API_ROUTES = {
  LINKS: "/api/links",
  EARLY_ACCESS: "/api/early-access",
  ADMIN_EARLY_ACCESS: "/api/admin/early-access",
} as const;

// Page routes
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  ADMIN: "/admin",
} as const;
