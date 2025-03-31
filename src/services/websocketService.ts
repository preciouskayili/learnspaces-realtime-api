import { Router } from "express";
import WebSocket, { WebSocketServer } from "ws";

const WEBSOCKET_PORT = process.env.WEBSOCKET_PORT;

export default function websocketService() {
  const wss = new WebSocketServer({ port: Number(WEBSOCKET_PORT) });

  wss.on("connection", (ws: WebSocket) => {
    console.log("Client connected");

    ws.on("message", (message: string) => {
      console.log(`Received: ${message}`);
      ws.send(
        JSON.stringify({
          event_type: `file_update`,
          data: { user: "preciouskayili", age: 10 },
        })
      );

      wss.clients.forEach((client) => {
        ws.send(
          JSON.stringify({
            event_type: `file_update`,
            data: { user: "preciouskayili", age: 10 },
          })
        );
        client.send(`Server received your message: ${message}`);
      });
    });

    ws.on("close", () => {
      console.log("Client disconnected");
    });
  });
}
