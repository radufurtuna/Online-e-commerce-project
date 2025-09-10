import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const rutePublice = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const sessionAuth = await auth();
  
  // Dacă utilizatorul nu este autentificat și nu este pe o rută publică
  if (!rutePublice(req) && !sessionAuth.userId) {
    return sessionAuth.redirectToSignIn();
  }
  
  // Dacă utilizatorul este deconectat și este pe o rută protejată, redirecționează către pagina principală
  if (rutePublice(req) && sessionAuth.userId) {
    return Response.redirect(new URL("/", req.url));
  }
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)","/(api|trpc)(.*)"],
};