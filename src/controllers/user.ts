import { Context } from "hono";

export class UserController {
  static async authorize(c: Context) {
    const user = c.req.header("Authorization");

    if (user) return c.json({ message: "User authorized" }, 201);

    return c.json({ message: "User not authorized" }, 401);
  }
}
