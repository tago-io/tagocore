import { createServer } from "node:http";
import path from "node:path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { getSystemName } from "@tago-io/tcore-shared";
import chalk from "chalk";
import compression from "compression";
import cors from "cors";
import express from "express";
import method_override from "method-override";
import AccountController from "./Controllers/Account/Account.ts";
import ActionController from "./Controllers/Action.ts";
import AnalysisController from "./Controllers/Analysis.ts";
import DeviceController from "./Controllers/Device/Device.ts";
import DeviceDataController from "./Controllers/DeviceData/DeviceData.ts";
import FileController from "./Controllers/File.ts";
import HardwareController from "./Controllers/Hardware.ts";
import LogsController from "./Controllers/Logs.ts";
import PluginsController, {
  resolvePluginImage,
  resolvePluginImage2,
} from "./Controllers/Plugins.ts";
import SettingsController from "./Controllers/Settings.ts";
import StatisticController from "./Controllers/Statistic.ts";
import SummaryController from "./Controllers/Summary.ts";
import SystemController from "./Controllers/System.ts";
import TagController from "./Controllers/Tag.ts";
import { logSystemStart, oraLog, oraLogError } from "./Helpers/log.ts";
import { shutdown } from "./Helpers/shutdown.ts";
import { startAllPlugins } from "./Plugins/Host.ts";
import { startCallbackInterval } from "./Plugins/Worker/Worker.ts";
import { startActionScheduleTimer } from "./Services/ActionScheduler.ts";
import { startDataRetentionTimer } from "./Services/DeviceDataRetention.ts";
import { getModuleList } from "./Services/Plugins.ts";
import { getMainSettings } from "./Services/Settings.ts";
import { setupSocketServer } from "./Socket/SocketServer.ts";

const app = express();
const httpServer = createServer(app);
const __filename = fileURLToPath(import.meta.url);
const dirname_ = dirname(__filename);

const consolePath = path.join(dirname_, "../../build/console");

/**
 * Sets up express and its configuration.
 */
async function setupExpress() {
  app.use(cors());
  app.disable("x-powered-by");
  app.use(compression());
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(express.text({ limit: "5mb" }));

  app.use(method_override("X-HTTP-Method")); // Microsoft
  app.use(method_override("X-HTTP-Method-Override")); // Google/GData
  app.use(method_override("X-Method-Override")); // IBM
  app.use(method_override("_method")); // QueryString
}

/**
 * Sets up the routes of express.
 */
async function setupExpressRoutes() {
  AccountController(app);
  SystemController(app);
  DeviceController(app);
  SummaryController(app);
  ActionController(app);
  AnalysisController(app);
  PluginsController(app);
  FileController(app);
  LogsController(app);
  DeviceDataController(app);
  SettingsController(app);
  StatisticController(app);
  HardwareController(app);
  TagController(app);

  app.use("/console", express.static(consolePath, { index: "./index.html" }));

  app.get("/", (req, res) => {
    res.redirect("/console");
  });

  app.get("/console/*", (req, res) => {
    res.header("content-type", "text/html");
    res.sendFile(`${consolePath}/index.html`);
  });

  app.get("/images/:plugin/:type/:identifier?", resolvePluginImage);
  app.get("/images2/:plugin/*", resolvePluginImage2);

  app.options("*", (req, res) => {
    const defaultHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
      "Access-Control-Allow-Headers":
        "Content-Type, Cache-Control, Pragma, X-Requested-With, Authorization, Account-Token, Device-Token, Token",
      "Content-Type": "application/json; charset=utf-8",
    };
    // const headers = { ...defaultHeaders };
    res.set(defaultHeaders);
  });

  app.use((err, req, res, next) => {
    if (err.stack.match(/body-parser/)) {
      res.status(400).send({
        status: false,
        result: {
          request_error: err.message,
          request_body: err.body,
          server_response: "Malformed request syntax",
        },
      });
    } else {
      next();
    }
  });
}

/**
 * Sets up the plugin pages.
 */
async function setupPluginPages() {
  const modules: any = getModuleList("page");

  for (const module of modules) {
    const fullPath = module.plugin.folder;
    const assetsPath = path.join(fullPath, module.setup.assets);
    const fullRoute = `/pages/${module.setup.route.substring(1)}`;
    app.use(fullRoute, express.static(assetsPath, { index: "./index.html" }));
  }

  app.use((req, res) => {
    res.status(404);
    res.send({ status: false, message: "Route Not Found" });
  });
}

/**
 * Starts listening on the application port.
 */
async function listenOnApplicationPort() {
  const settings = await getMainSettings();
  const port = Number(settings.port);

  const systemName = getSystemName();

  httpServer
    .listen(port, () => {
      logSystemStart();
    })
    .on("error", () => {
      oraLogError(
        "api",
        chalk.redBright(`Could not start ${systemName} on port ${port}`),
      );
      oraLogError(
        "api",
        chalk.redBright(
          "Check if the port is not being used by another application",
        ),
      );
      process.exit(1);
    });
}

/**
 * Starts the application.
 */
export async function startServer() {
  oraLog("api", `Started ${getSystemName()}`);

  startCallbackInterval();

  await setupExpress();
  await setupExpressRoutes();
  await setupSocketServer(httpServer);

  await startAllPlugins();
  await setupPluginPages();

  await listenOnApplicationPort();
  startActionScheduleTimer();
  startDataRetentionTimer();

  process.on("SIGTERM", () => shutdown(httpServer));
  process.on("SIGINT", () => shutdown(httpServer));
}

const watchMode = process.argv.join(" ").includes("server/main.ts");
if (watchMode) {
  startServer();
}
