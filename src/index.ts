import { Hocuspocus } from "@hocuspocus/server";
import { serve } from "@hono/node-server";
import { Hono } from "hono";

const app = new Hono();
const server = new Hocuspocus({
  port: 1234,
});

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

const port = 8000;
console.log(`Server is running on port ${port}`);

server.listen();
serve({
  fetch: app.fetch,
  port,
});
