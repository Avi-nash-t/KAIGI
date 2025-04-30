import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const protectdRoutes = createRouteMatcher([
    '/',
    '/upcoming',
    '/recording',
    '/previous',
    '/personal-room',
    '/meeting(.*)',
])

export default clerkMiddleware((auth,req) => {
    if(protectdRoutes(req)) auth().protect();
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};