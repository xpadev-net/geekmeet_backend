import { setupSocketIO } from "@/socketio";
import express from "express";
import * as http from "http";
import cors from "cors";
import { ExpressCorsHost } from "@/config";

export const setupExpress = (port: number) => {
  const app = express();
  const server = http.createServer(app);
  setupSocketIO(server);
  app.use(
    cors({
      origin: ExpressCorsHost,
      optionsSuccessStatus: 200,
    })
  );
  app.get("/healthz", (req, res) => {
    res.send("ok");
  });

  server.listen(port);
};
