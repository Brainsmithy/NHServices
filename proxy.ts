import { auth } from "@/auth";

export default auth((req) => {
  const isAdmin = req.auth?.user?.role === "admin";
  const isLoginPage = req.nextUrl.pathname === "/admin/login";
  if (isLoginPage) return;
  if (!isAdmin) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return Response.redirect(url);
  }
});

export const config = {
  matcher: ["/admin/:path*"],
};
