import { cors } from "hono/cors";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { hocuspocusServer } from "./services/hocuspocus";
import router from "./routes";
import { Server } from "socket.io";

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

app.route(`${process.env.API_VERSION}/`, router);

const APP_PORT = process.env.PORT;

console.log(`Server is running on port ${APP_PORT}`);

serve({
  fetch: app.fetch,
  port: Number(APP_PORT),
});

hocuspocusServer.listen();
