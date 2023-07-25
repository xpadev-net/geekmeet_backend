import { setupSocketIO } from "@/socketio";
import * as fs from "fs";
import express from "express";
import * as https from "https";
import cors from "cors";
import { ExpressCorsHost } from "@/config";

export const setupExpress = (port: number) => {
  const app = express();
  const server = https.createServer(
    {
      key: fs.readFileSync(`${__dirname}/../server-key.pem`),
      cert: fs.readFileSync(`${__dirname}/../server-crt.pem`),
    },
    app
  );
  setupSocketIO(server);
  app.use(
    cors({
      origin: ExpressCorsHost,
      optionsSuccessStatus: 200,
    })
  );
  app.use(express.static("./public"));

  server.listen(port);
};