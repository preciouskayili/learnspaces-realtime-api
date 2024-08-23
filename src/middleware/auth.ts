import { Context, Next } from "hono";
import { getCookie } from "hono/cookie";
import { supabaseClient } from "../config/supabase";

export async function authMiddleware(c: Context, next: Next) {
  const session = getCookie(c, "session");

  if (!session) {
    return c.json({ error: "No token provided" }, 401);
  }

  try {
    const supabase = supabaseClient(session);

    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) {
      return c.json({ error: "Invalid token" }, 401);
    }

    await next();
  } catch (err) {
    console.error("Error verifying token:", err);
    return c.json({ error: "Invalid token" }, 401);
  }
}
