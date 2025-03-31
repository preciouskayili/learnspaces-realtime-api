import { Router } from "express";
import WebSocket, { WebSocketServer } from "ws";

const WEBSOCKET_PORT = process.env.WEBSOCKET_PORT;

export default function websocketService() {
  const wss = new WebSocketServer({ port: Number(WEBSOCKET_PORT) });

  wss.on("connection", (ws: WebSocket) => {
    console.log("Client connected");

    ws.on("message", (message: string) => {
      wss.clients.forEach((client) => {
        const data = JSON.parse(message);
        client.send(JSON.stringify(data));

        // ws.send(
        //   JSON.stringify({
        //     event_type: `file_update`,
        //     data: { user: "preciouskayili", age: 10 },
        //   })
        // );
        // client.send();
      });
    });

    ws.on("close", () => {
      console.log("Client disconnected");
    });
  });
}
