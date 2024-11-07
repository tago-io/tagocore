import { DatabaseModule, helpers } from "@tago-io/tcore-sdk";
import createAccount from "./Providers/Account/createAccount.ts";
import createAccountToken from "./Providers/Account/createAccountToken.ts";
import getAccountAmount from "./Providers/Account/getAccountAmount.ts";
import getAccountByToken from "./Providers/Account/getAccountByToken.ts";
import getAccountByUsername from "./Providers/Account/getAccountByUsername.ts";
import getAccountInfo from "./Providers/Account/getAccountInfo.ts";
import getAccountList from "./Providers/Account/getAccountList.ts";
import getAccountToken from "./Providers/Account/getAccountToken.ts";
import createAction from "./Providers/Action/createAction.ts";
import deleteAction from "./Providers/Action/deleteAction.ts";
import editAction from "./Providers/Action/editAction.ts";
import getActionInfo from "./Providers/Action/getActionInfo.ts";
import getActionList from "./Providers/Action/getActionList.ts";
import addAnalysisLog from "./Providers/Analysis/addAnalysisLog.ts";
import createAnalysis from "./Providers/Analysis/createAnalysis.ts";
import deleteAnalysis from "./Providers/Analysis/deleteAnalysis.ts";
import deleteAnalysisLogs from "./Providers/Analysis/deleteAnalysisLogs.ts";
import editAnalysis from "./Providers/Analysis/editAnalysis.ts";
import getAnalysisInfo from "./Providers/Analysis/getAnalysisInfo.ts";
import getAnalysisList from "./Providers/Analysis/getAnalysisList.ts";
import getAnalysisLogs from "./Providers/Analysis/getAnalysisLogs.ts";
import createDevice from "./Providers/Device/createDevice.ts";
import createDeviceToken from "./Providers/Device/createDeviceToken.ts";
import deleteDevice from "./Providers/Device/deleteDevice.ts";
import deleteDeviceParam from "./Providers/Device/deleteDeviceParam.ts";
import deleteDeviceToken from "./Providers/Device/deleteDeviceToken.ts";
import editDevice from "./Providers/Device/editDevice.ts";
import emptyDevice from "./Providers/Device/emptyDevice.ts";
import getDeviceByToken from "./Providers/Device/getDeviceByToken.ts";
import getDeviceInfo from "./Providers/Device/getDeviceInfo.ts";
import getDeviceList from "./Providers/Device/getDeviceList.ts";
import getDeviceParamList from "./Providers/Device/getDeviceParamList.ts";
import getDeviceToken from "./Providers/Device/getDeviceToken.ts";
import getDeviceTokenList from "./Providers/Device/getDeviceTokenList.ts";
import setDeviceParams from "./Providers/Device/setDeviceParams.ts";
import addDeviceData from "./Providers/DeviceData/addDeviceData.ts";
import applyDeviceDataRetention from "./Providers/DeviceData/applyDeviceDataRetention.ts";
import deleteDeviceData from "./Providers/DeviceData/deleteDeviceData.ts";
import editDeviceData from "./Providers/DeviceData/editDeviceData.ts";
import exportDeviceData from "./Providers/DeviceData/exportDeviceData.ts";
import getDeviceDataAmount from "./Providers/DeviceData/getDeviceDataAmount.ts";
import getDeviceDataAvg from "./Providers/DeviceData/getDeviceDataAvg.ts";
import getDeviceDataCount from "./Providers/DeviceData/getDeviceDataCount.ts";
import getDeviceDataDefaultQ from "./Providers/DeviceData/getDeviceDataDefaultQ.ts";
import getDeviceDataFirstInsert from "./Providers/DeviceData/getDeviceDataFirstInsert.ts";
import getDeviceDataFirstItem from "./Providers/DeviceData/getDeviceDataFirstItem.ts";
import getDeviceDataFirstLocation from "./Providers/DeviceData/getDeviceDataFirstLocation.ts";
import getDeviceDataFirstValue from "./Providers/DeviceData/getDeviceDataFirstValue.ts";
import getDeviceDataLastInsert from "./Providers/DeviceData/getDeviceDataLastInsert.ts";
import getDeviceDataLastItem from "./Providers/DeviceData/getDeviceDataLastItem.ts";
import getDeviceDataLastLocation from "./Providers/DeviceData/getDeviceDataLastLocation.ts";
import getDeviceDataLastValue from "./Providers/DeviceData/getDeviceDataLastValue.ts";
import getDeviceDataMax from "./Providers/DeviceData/getDeviceDataMax.ts";
import getDeviceDataMin from "./Providers/DeviceData/getDeviceDataMin.ts";
import getDeviceDataSum from "./Providers/DeviceData/getDeviceDataSum.ts";
import importDeviceData from "./Providers/DeviceData/importDeviceData.ts";
import deletePluginStorageItem from "./Providers/PluginStorage/deletePluginStorageItem.ts";
import getAllPluginStorageItems from "./Providers/PluginStorage/getAllPluginStorageItem.ts";
import getPluginStorageItem from "./Providers/PluginStorage/getPluginStorageItem.ts";
import setPluginStorageItem from "./Providers/PluginStorage/setPluginStorageItem.ts";
import addStatistic from "./Providers/Statistic/addStatistic.ts";
import getHourlyStatistics from "./Providers/Statistic/getHourlyStatistics.ts";
import getSummary from "./Providers/Summary/getSummary.ts";
import getTagKeys from "./Providers/Tag/getTagKeys.ts";
import { destroyKnex, setupKnex } from "./knex.ts";

/**
 * Starts the database module.
 */
async function startModule() {
  const filename = await helpers.getFileURI("data.db");
  const sqlite = new DatabaseModule({
    id: "sqlite",
    name: "SQLite",
    configs: [
      {
        type: "file",
        field: "file",
        name: "Database file",
        icon: "database",
        defaultValue: filename,
      },
    ],
  });

  sqlite.onLoad = setupKnex;
  sqlite.onDestroy = destroyKnex;

  sqlite.addAnalysisLog = addAnalysisLog;
  sqlite.addDeviceData = addDeviceData;
  sqlite.addStatistic = addStatistic;
  sqlite.applyDeviceDataRetention = applyDeviceDataRetention;
  sqlite.createAccount = createAccount;
  sqlite.createAccountToken = createAccountToken;
  sqlite.createAction = createAction;
  sqlite.createAnalysis = createAnalysis;
  sqlite.createDevice = createDevice;
  sqlite.createDeviceToken = createDeviceToken;
  sqlite.deleteAction = deleteAction;
  sqlite.deleteAnalysis = deleteAnalysis;
  sqlite.deleteAnalysisLogs = deleteAnalysisLogs;
  sqlite.deleteDevice = deleteDevice;
  sqlite.deleteDeviceData = deleteDeviceData;
  sqlite.deleteDeviceParam = deleteDeviceParam;
  sqlite.deleteDeviceToken = deleteDeviceToken;
  sqlite.deletePluginStorageItem = deletePluginStorageItem;
  sqlite.editAction = editAction;
  sqlite.editAnalysis = editAnalysis;
  sqlite.editDevice = editDevice;
  sqlite.editDeviceData = editDeviceData;
  sqlite.emptyDevice = emptyDevice;
  sqlite.getAccountAmount = getAccountAmount;
  sqlite.getAccountByToken = getAccountByToken;
  sqlite.getAccountByUsername = getAccountByUsername;
  sqlite.getAccountInfo = getAccountInfo;
  sqlite.getAccountList = getAccountList;
  sqlite.getAccountToken = getAccountToken;
  sqlite.getActionInfo = getActionInfo;
  sqlite.getActionList = getActionList;
  sqlite.getAllPluginStorageItems = getAllPluginStorageItems;
  sqlite.getAnalysisInfo = getAnalysisInfo;
  sqlite.getAnalysisList = getAnalysisList;
  sqlite.getAnalysisLogs = getAnalysisLogs;
  sqlite.getDeviceByToken = getDeviceByToken;
  sqlite.getDeviceDataAmount = getDeviceDataAmount;
  sqlite.getDeviceDataAvg = getDeviceDataAvg;
  sqlite.getDeviceDataCount = getDeviceDataCount;
  sqlite.getDeviceDataDefaultQ = getDeviceDataDefaultQ;
  sqlite.getDeviceDataFirstInsert = getDeviceDataFirstInsert;
  sqlite.getDeviceDataFirstItem = getDeviceDataFirstItem;
  sqlite.getDeviceDataFirstLocation = getDeviceDataFirstLocation;
  sqlite.getDeviceDataFirstValue = getDeviceDataFirstValue;
  sqlite.getDeviceDataLastInsert = getDeviceDataLastInsert;
  sqlite.getDeviceDataLastItem = getDeviceDataLastItem;
  sqlite.getDeviceDataLastLocation = getDeviceDataLastLocation;
  sqlite.getDeviceDataLastValue = getDeviceDataLastValue;
  sqlite.getDeviceDataMax = getDeviceDataMax;
  sqlite.getDeviceDataMin = getDeviceDataMin;
  sqlite.getDeviceDataSum = getDeviceDataSum;
  sqlite.getDeviceInfo = getDeviceInfo;
  sqlite.getDeviceList = getDeviceList;
  sqlite.getDeviceParamList = getDeviceParamList;
  sqlite.getDeviceToken = getDeviceToken;
  sqlite.getDeviceTokenList = getDeviceTokenList;
  sqlite.getHourlyStatistics = getHourlyStatistics;
  sqlite.getPluginStorageItem = getPluginStorageItem;
  sqlite.getSummary = getSummary;
  sqlite.getTagKeys = getTagKeys;
  sqlite.setDeviceParams = setDeviceParams;
  sqlite.setPluginStorageItem = setPluginStorageItem;
  sqlite.exportDeviceData = exportDeviceData;
  sqlite.importDeviceData = importDeviceData;
}

startModule();
