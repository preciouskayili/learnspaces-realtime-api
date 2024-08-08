import { Server } from "@hocuspocus/server";
import { Database } from "@hocuspocus/extension-database";
import { supabase } from "../config/supabase";

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
          console.log(data);

          resolve(data?.document);
        });
      },
      store: async ({ documentName, state }) => {
        await supabase
          .from("pods")
          .update({ document: state })
          .eq("id", documentName);
      },
    }),
  ],
});
