import { Context, Next } from "hono";
import supabaseClient from "../config/supabase";

export async function authMiddleware(c: Context, next: Next) {
  const authHeader = c.req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json({ error: "No token provided" }, 401);
  }

  const accessToken = authHeader.split(" ")[1];

  try {
    const supabase = supabaseClient(accessToken);

    const { data, error } = await supabase.auth.getUser(accessToken);

    if (error || !data.user) {
      return c.json({ error: "Invalid token" }, 401);
    }

    await next();
  } catch (err) {
    console.error("Error verifying token:", err);
    return c.json({ error: "Invalid token" }, 401);
  }
}
