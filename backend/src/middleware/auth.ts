import type { Context, Next } from "hono";
import { supabase } from "../lib/supabase";
import { prisma } from "../db/prisma";

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
}

export type AuthEnv = {
  Variables: {
    user: AuthUser;
  };
};

export async function requireAuth(c: Context<AuthEnv>, next: Next) {
  const authHeader = c.req.header("Authorization");

  // Validates the Authorization header
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json({ error: "Missing or invalid Authorization header" }, 401);
  }

  const token = authHeader.slice("Bearer ".length).trim();

  try {
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      return c.json({ error: error?.message || "Unauthorized" }, 401);
    }

    const sbUser = data.user;
    const email = sbUser.email || `${sbUser.id}@magnetio.internal`;
    const name =
      sbUser.user_metadata?.full_name || sbUser.user_metadata?.name || email.split("@")[0];

    // Watchlist/history rows FK to users.id — the local row must exist
    try {
      await prisma.user.upsert({
        where: { id: sbUser.id },
        update: { email, name },
        create: {
          id: sbUser.id,
          email,
          name,
        },
      });
    } catch (dbErr) {
      console.error("Could not sync user to local DB:", dbErr);
      return c.json({ error: "Failed to sync user profile. Check DATABASE_URL." }, 503);
    }

    const authUser: AuthUser = {
      id: sbUser.id,
      email,
      name,
    };

    c.set("user", authUser);
    await next();
  } catch (err) {
    return c.json({ error: err instanceof Error ? err.message : "Authentication failed" }, 401);
  }
}
