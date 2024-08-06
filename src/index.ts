import { Hocuspocus, Server } from "@hocuspocus/server";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { hocuspocusServer } from "./services/hocuspocus";
import router from "./routes";

const app = new Hono();

app.route(`${process.env.API_VERSION}/`, router);

const port = 8787;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});

hocuspocusServer.listen();
