import http from "node:http";
import os from "node:os";
import { helpers, pluginStorage } from "@tago-io/tcore-sdk";
import bodyParser from "body-parser";
import cors from "cors";
import express, { type Request, type Response } from "express";
import pkg from "../../package.json" with { type: "json" };
import { cache } from "./Global.ts";
import { getMachineID } from "./Helpers.ts";
import { createTCore, sendDataToTagoio } from "./Request.ts";
import { closeRealtimeConnection, startRealtimeCommunication } from "./RealtimeConnection.ts";
import { Server } from "socket.io";

let server: http.Server | null = null;

/**
 */
function initServer() {
  if (server) {
    return;
  }

  const app = express();
  app.use(cors());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  app.get("/tcore", routeGetTCore);
  app.put("/tcore", (req, res) => {
    if (cache.tcore) {
      cache.tcore.active = !!req.body.active;
    }
  });
  app.post("/start", routeStartTCore);
  app.post("/sign-out", routeSignOut);

  server = http.createServer(app);
  server.listen("8999");

  cache.serverIO = new Server(server);
  cache.serverIO.on("connection", () => {
    if (cache.events) {
      cache.serverIO?.emit("status", { status: true });
    }
  });
}

/**
 */
function closeServer() {
  server?.close();
  server = null;
}

/**
 */
async function routeGetTCore(req: Request, res: Response) {
  const tcore = await pluginStorage.get("tcore").catch(() => null);
  if (tcore) {
    res.status(200);
    res.send({ status: true, result: tcore });
  } else {
    res.status(404);
    res.send({ status: false });
  }
}

/**
 */
async function routeSignOut(req: Request, res: Response) {
  await pluginStorage.delete("token");
  closeRealtimeConnection();
  res.sendStatus(200);
}

/**
 */
async function routeStartTCore(req: Request, res: Response) {
  const systemStartTime = new Date(Date.now() - os.uptime() * 1000);
  const tcoreStartTime = new Date(Date.now() - process.uptime() * 1000);
  const osInfo = await helpers.getOSInfo();
  const profileToken = "p-".concat(req.headers.token as string);
  const item = await pluginStorage.get("tcore").catch(() => null);

  if (item?.token) {
    await sendDataToTagoio(profileToken, { name: req.body.name }, item.id, "update-tcore-connect");
    await pluginStorage.set("token", item?.token);
    await startRealtimeCommunication(item?.token);
    res.sendStatus(200);
    return;
  }

  const data = await createTCore(profileToken, {
    machine_id: getMachineID(),
    name: req.body.name,
    system_start_time: systemStartTime.toISOString(),
    tcore_start_time: tcoreStartTime.toISOString(),
    tcore_version: pkg.version,
    os: osInfo,
  }).catch((err) => {
    console.log(err);
    return null;
  });

  if (data) {
    const tcore = await sendDataToTagoio(profileToken, { summary: true }, data.id, "get-tcore");
    if (tcore) {
      await pluginStorage.set("token", data?.token);
      await pluginStorage.set("tcore", tcore);
      await startRealtimeCommunication(data?.token);
      res.sendStatus(200);
    }
  }
}

export { closeServer, initServer };
