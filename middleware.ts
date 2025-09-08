import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const rutePublice = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const sessionAuth = await auth();
  if (!rutePublice(req) && !sessionAuth.userId) {
    return sessionAuth.redirectToSignIn();
  }
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)","/(api|trpc)(.*)"],
};