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
  matcher: [],
};
