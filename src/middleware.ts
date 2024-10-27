import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
  const session = context.cookies.get("session")?.value ?? null;

  //if (!session) {
  //  context.locals.user = null;
  //
  //  if (
  //    !context.url.pathname.startsWith("/login")
  //  ) {
  //    return context.redirect("/login");
  //  }
  //
  //  return next();
  //}
  //
  //if (
  //  session &&
  //  (context.url.pathname.startsWith("/login") ||
  //    context.url.pathname.startsWith("/register"))
  //) {
  //  return context.redirect("/");
  //}

  return next();
});
