import { cors } from "hono/cors";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { hocuspocusServer } from "./services/hocuspocus";
import router from "./routes";

const app = new Hono();

app.use(
  `/${process.env.API_VERSION}/*`,
  cors({ credentials: true, origin: "http://localhost:3000" })
);
app.route(`${process.env.API_VERSION}/`, router);

const port = 8787;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});

hocuspocusServer.listen();
