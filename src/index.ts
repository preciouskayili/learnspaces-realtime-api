import { cors } from "hono/cors";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { hocuspocusServer } from "./services/hocuspocus";
import router from "./routes";
import { PeerServer } from "peer";

const app = new Hono();

PeerServer({ port: 9000, path: `${process.env.API_VERSION}/peerjs` });

app.use(
  `/${process.env.API_VERSION}/*`,
  cors({ credentials: true, origin: process.env.CLIENT_ORIGIN! })
);

app.route(`${process.env.API_VERSION}/`, router);

const port = 8787;

console.log(`Server is running on port ${port}`);
console.log(`Peer Server running on port 9000`);
console.log(`Press Ctrl+C to quit`);

serve({
  fetch: app.fetch,
  port,
});

hocuspocusServer.listen();
