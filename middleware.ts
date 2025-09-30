import { withAuth } from "next-auth/middleware";

export default withAuth(
  // Add any additional middleware logic here
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    },
  },
);

export const config = {
  matcher: [
    // Protect API routes that need authentication (except auth routes)
    "/api/((?!auth).)*",
  ],
};
