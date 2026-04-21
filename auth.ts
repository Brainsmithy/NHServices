import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { supabase } from "@/db";

// JWT session strategy — no DB adapter required for credentials-only auth.
// The auth_* tables in db/schema.sql exist for a future OAuth provider.
export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/admin/login" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(creds) {
        const email =
          typeof creds?.email === "string" ? creds.email : undefined;
        const password =
          typeof creds?.password === "string" ? creds.password : undefined;
        if (!email || !password) return null;

        const { data: user, error } = await supabase
          .from("users")
          .select("id, email, password_hash, role")
          .eq("email", email.toLowerCase())
          .maybeSingle();
        if (error || !user) return null;

        const ok = await bcrypt.compare(password, user.password_hash);
        if (!ok) return null;

        return { id: user.id, email: user.email, role: user.role };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role ?? "admin";
        token.sub = (user as { id?: string }).id ?? token.sub;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.role = (token.role as string) ?? "admin";
      }
      return session;
    },
  },
});
