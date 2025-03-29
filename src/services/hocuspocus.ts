import { Server } from "@hocuspocus/server";
import { Database } from "@hocuspocus/extension-database";
import { base64ToUint8Array, uint8ArrayToBase64 } from "../utils";
import { supabaseClient } from "../config/supabase";

export const hocuspocusServer = Server.configure({
  async onAuthenticate({ token }) {
    if (!token) {
      throw new Error("No token provided");
    }

    const supabase = supabaseClient(token);
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) {
      throw new Error("Invalid token");
    }

    return {
      user: data.user,
      token: token,
    };
  },
  extensions: [
    new Database({
      fetch: async ({ documentName, context }) => {
        return new Promise(async (resolve, reject) => {
          const supabase = supabaseClient(context.token);
          const { data, error } = await supabase
            .from("pods")
            .select("document")
            .eq("id", documentName)
            .single();

          if (error) reject(error);

          if (data?.document) {
            const uint8Array = base64ToUint8Array(data.document);

            resolve(uint8Array);
          } else {
            resolve(null);
          }
        });
      },
      store: async ({ documentName, state, context }) => {
        const base64String = uint8ArrayToBase64(
          state as Uint8Array<ArrayBufferLike>
        );

        const supabase = supabaseClient(context.token);
        await supabase
          .from("pods")
          .update({ document: base64String })
          .eq("id", documentName)
          .single();
      },
    }),
  ],
});
