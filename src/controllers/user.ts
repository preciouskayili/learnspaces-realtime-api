import { Context } from "hono";
import { setCookie } from "hono/cookie";

export class UserController {
  static async authorize(c: Context) {
    const token = c.req.header("Authorization");

    if (token) {
      setCookie(c, "session", token);
      return c.json({ message: "User authorized" }, 201);
    }

    return c.json({ message: "Failed to authorize user" }, 401);
  }
}
