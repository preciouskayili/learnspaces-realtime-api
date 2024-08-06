import { Server } from "@hocuspocus/server";
import { Database } from "@hocuspocus/extension-database";
import { supabase } from "../config/supabase";


export const hocuspocusServer = Server.configure({
  // Add your Hocuspocus configuration here
  // For example:
  // async onChange(data) {
  //   console.log('Document changed:', data)
  // },
  port: 1234,
	extensions: [
		new Database({
			fetch: async ({ documentName }) => {
				return new Promise(async (resolve, reject) => {
					await supabase.from("spaces")
				})
			}
		})
	]
});
