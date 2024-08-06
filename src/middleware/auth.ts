import { Context, Next } from "hono";
import { supabase } from "../config/supabase";

export async function authMiddleware(c: Context, next: Next) {
  const token = c.req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return c.json({ error: "No token provided" }, 401);
  }

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    return c.json({ error: "Invalid token" }, 401);
  }

  c.set("user", data.user);
  await next();
}
