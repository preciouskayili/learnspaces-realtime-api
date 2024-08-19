import { Extension } from "@hocuspocus/server";
import { supabase } from "../src/config/supabase";

export class AuthExtension implements Extension {
  async onAuthenticate(data: any) {
    const { token } = data;

    if (!token) {
      throw new Error("No token provided");
    }

    try {
      const { data: user, error } = await supabase.auth.getUser(token);

      if (error) {
        throw new Error("Invalid token");
      }

      // You can add more checks here, e.g., to verify if the user has access to the specific document

      return {
        user: user.user,
      };
    } catch (err) {
      console.error("Authentication error:", err);
      throw new Error("Authentication failed");
    }
  }
}
