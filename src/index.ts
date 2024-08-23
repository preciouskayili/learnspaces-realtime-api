import { cors } from "hono/cors";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { hocuspocusServer } from "./services/hocuspocus";
import router from "./routes";
import { PeerServer } from "peer";
import { createWorker } from "./config/mediasoup-config";

const app = new Hono();

app.use(
  `*`,
  cors({
    origin: [`${process.env.CLIENT_ORIGIN}`],
    allowHeaders: ["Authorization", "Content-Type"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    maxAge: 86400,
  })
);

(async () => {
  await createWorker();
})();

PeerServer({ port: 9000, path: `${process.env.API_VERSION}/peerjs` });

app.route(`${process.env.API_VERSION}/`, router);

const port = 8787;

console.log(`Server is running on port ${port}`);
console.log(`Peer Server running on port 9000`);

serve({
  fetch: app.fetch,
  port,
});

hocuspocusServer.listen();
