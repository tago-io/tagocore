import http from "node:http";
import os from "node:os";
import { helpers, pluginStorage } from "@tago-io/tcore-sdk";
import bodyParser from "body-parser";
import cors from "cors";
import express, { type Request, type Response } from "express";
import pkg from "../../package.json" with { type: "json" };
import { cache } from "./Global.ts";
import { getMachineID } from "./Helpers.ts";
import { createTCore, listTCoresByMachineID, updateTCore } from "./Request.ts";
import { closeRealtimeConnection, startRealtimeCommunication } from "./RealtimeConnection.ts";

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
}

/**
 */
function closeServer() {
  server?.close();
  server = null;
}

/**
 */
function routeGetTCore(req: Request, res: Response) {
  if (cache.tcore) {
    res.status(200);
    res.send({ status: true, result: cache.tcore });
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
  cache.tcore = null;
  res.sendStatus(200);
}

/**
 */
async function routeStartTCore(req: Request, res: Response) {
  const systemStartTime = new Date(Date.now() - os.uptime() * 1000);
  const tcoreStartTime = new Date(Date.now() - process.uptime() * 1000);
  const osInfo = await helpers.getOSInfo();
  const profileToken = req.headers.token as string;

  const list = await listTCoresByMachineID(profileToken).catch(() => null);
  const item = list?.[0] as any;

  if (item?.token) {
    await updateTCore(profileToken, item.id, { name: req.body.name });
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
    await pluginStorage.set("token", data?.token);
    await startRealtimeCommunication(data?.token);
    res.sendStatus(200);
  }
}

export { closeServer, initServer };
