import { Context } from "hono";
import { hocuspocusServer } from "../services/hocuspocus";

export class CollaborationController {
  static async getCollaborationUrl(c: Context) {
    const documentId = c.req.param("documentId");
    const user = c.get("user");

    try {
      const websocketUrl = `${hocuspocusServer.webSocketURL}/${documentId}`;

      return c.json({ websocketUrl });
    } catch (error) {
      console.error("Error getting websocket URL:", error);
      return c.json({ error: "Failed to get collaboration URL" }, 500);
    }
  }
}
