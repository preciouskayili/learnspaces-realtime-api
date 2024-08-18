import { Context, Next } from "hono";
import { supabase } from "../config/supabase";
import { getCookie } from "hono/cookie";

export async function authMiddleware(c: Context, next: Next) {
  const authToken0 = getCookie(
    c,
    `sb-${process.env.SUPABASE_APP_ID}-auth-token.0`
  );
  const authToken1 = getCookie(
    c,
    `sb-${process.env.SUPABASE_APP_ID}-auth-token.1`
  );

  const authToken = authToken0! + authToken1;

  if (!authToken) {
    return c.json({ error: "No token provided" }, 401);
  }

  try {
    const { access_token, refresh_token } = JSON.parse(authToken);

    if (!access_token || !refresh_token)
      return c.json({ error: "Invalid token provided" }, 401);

    const { data, error } = await supabase.auth.setSession({
      access_token,
      refresh_token,
    });

    if (error || !data.user) {
      return c.json({ error: "Invalid token" }, 401);
    }

    c.set("user", data.user);
    await next();
  } catch (err) {
    console.error("Error parsing cookie value:", err);
    return c.json({ error: "Invalid token" }, 401);
  }
}
