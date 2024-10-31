import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token }) => {
      return !!token; // Ensure it returns a boolean
    },
  },
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: [
    "/",
    "/muzakki/:path*",
    "/mustahik/:path*",
    "/kategori/:path*",
    "/periode/:path*",
    "/unit/:path*",
  ],
};
