import { Server } from "@hocuspocus/server";
import { Database } from "@hocuspocus/extension-database";
import { supabase } from "../config/supabase";
import { base64ToUint8Array, uint8ArrayToBase64 } from "../utils";

export const hocuspocusServer = Server.configure({
  port: 1234,
  extensions: [
    new Database({
      fetch: async ({ documentName }) => {
        return new Promise(async (resolve, reject) => {
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
      store: async ({ documentName, state }) => {
        const base64String = uint8ArrayToBase64(state);

        await supabase
          .from("pods")
          .update({ document: base64String })
          .eq("id", documentName).single();
      },
    }),
  ],
});
