import { Server } from "@hocuspocus/server";
import { Database } from "@hocuspocus/extension-database";
import { supabase } from "../config/supabase";

// Helper function to convert Uint8Array to Base64 string
function uint8ArrayToBase64(uint8Array: Uint8Array) {
  return Buffer.from(uint8Array).toString("base64");
}

// Helper function to convert Base64 string back to Uint8Array
function base64ToUint8Array(base64String: string) {
  const buffer = Buffer.from(base64String, "base64");
  return new Uint8Array(buffer);
}

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
            // Convert the stored Base64 string back to Uint8Array
            const uint8Array = base64ToUint8Array(data.document);
            resolve(uint8Array);
          } else {
            resolve(null);
          }
        });
      },
      store: async ({ documentName, state }) => {
        console.log("Storing!");

        // Convert Uint8Array to Base64 string before storing
        const base64String = uint8ArrayToBase64(state);

        await supabase
          .from("pods")
          .update({ document: base64String })
          .eq("id", documentName);
      },
    }),
  ],
});
