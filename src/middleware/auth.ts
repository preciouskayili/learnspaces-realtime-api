import { Context, Next } from "hono";
import { supabase } from "../config/supabase";
import { setCookie } from "hono/cookie";

export async function authMiddleware(c: Context, next: Next) {
  const authHeader = c.req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json({ error: "No token provided" }, 401);
  }

  const accessToken = authHeader.split(" ")[1];

  try {
    const { data, error } = await supabase.auth.getUser(accessToken);

    if (error || !data.user) {
      return c.json({ error: "Invalid token" }, 401);
    }

    // Create a session object similar to what Supabase would create
    const session = {
      access_token: accessToken,
      // You might need to add more fields here depending on what Supabase includes in its session
    };

    const sessionStr = JSON.stringify(session);
    const halfLength = Math.ceil(sessionStr.length / 2);

    // Set the two cookies
    setCookie(
      c,
      `sb-${process.env.SUPABASE_PROJECT_ID}-auth-token-0`,
      sessionStr.slice(0, halfLength),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: "/",
      }
    );

    setCookie(
      c,
      `sb-${process.env.SUPABASE_PROJECT_ID}-auth-token-1`,
      sessionStr.slice(halfLength),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: "/",
      }
    );

    c.set("user", data.user);
    await next();
  } catch (err) {
    console.error("Error verifying token:", err);
    return c.json({ error: "Invalid token" }, 401);
  }
}
