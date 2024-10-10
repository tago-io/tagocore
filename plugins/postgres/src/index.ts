import { DatabaseModule } from "@tago-io/tcore-sdk";
import configs from "./settings";
import addDeviceData from "./Providers/DeviceData/addDeviceData";
import editDeviceData from "./Providers/DeviceData/editDeviceData";
import createAction from "./Providers/Action/createAction";
import createAnalysis from "./Providers/Analysis/createAnalysis";
import createDevice from "./Providers/Device/createDevice";
import createDeviceToken from "./Providers/Device/createDeviceToken";
import deleteAction from "./Providers/Action/deleteAction";
import deleteAnalysis from "./Providers/Analysis/deleteAnalysis";
import deleteAnalysisLogs from "./Providers/Analysis/deleteAnalysisLogs";
import deleteDevice from "./Providers/Device/deleteDevice";
import deleteDeviceParam from "./Providers/Device/deleteDeviceParam";
import deleteDeviceToken from "./Providers/Device/deleteDeviceToken";
import editAction from "./Providers/Action/editAction";
import editAnalysis from "./Providers/Analysis/editAnalysis";
import editDevice from "./Providers/Device/editDevice";
import getActionInfo from "./Providers/Action/getActionInfo";
import getActionList from "./Providers/Action/getActionList";
import getAnalysisInfo from "./Providers/Analysis/getAnalysisInfo";
import getAnalysisList from "./Providers/Analysis/getAnalysisList";
import getDeviceDataDefaultQ from "./Providers/DeviceData/getDeviceDataDefaultQ";
import getDeviceDataAmount from "./Providers/DeviceData/getDeviceDataAmount";
import getDeviceByToken from "./Providers/Device/getDeviceByToken";
import getDeviceInfo from "./Providers/Device/getDeviceInfo";
import getDeviceList from "./Providers/Device/getDeviceList";
import getDeviceParamList from "./Providers/Device/getDeviceParamList";
import getDeviceTokenList from "./Providers/Device/getDeviceTokenList";
import getPluginStorageItem from "./Providers/PluginStorage/getPluginStorageItem";
import getSummary from "./Providers/Summary/getSummary";
import deletePluginStorageItem from "./Providers/PluginStorage/deletePluginStorageItem";
import setDeviceParams from "./Providers/Device/setDeviceParams";
import { destroyKnex, setupKnex } from "./Database";
import getTagKeys from "./Providers/Tag/getTagKeys";
import addStatistic from "./Providers/Statistic/addStatistics";
import getHourlyStatistics from "./Providers/Statistic/getHourlyStatistics";
import emptyDevice from "./Providers/Device/emptyDevice";
import getDeviceDataLastValue from "./Providers/DeviceData/getDeviceDataLastValue";
import getDeviceDataLastLocation from "./Providers/DeviceData/getDeviceDataLastLocation";
import getDeviceDataLastItem from "./Providers/DeviceData/getDeviceDataLastItem";
import getDeviceDataLastInsert from "./Providers/DeviceData/getDeviceDataLastInsert";
import getDeviceDataFirstValue from "./Providers/DeviceData/getDeviceDataFirstValue";
import getDeviceDataFirstLocation from "./Providers/DeviceData/getDeviceDataFirstLocation";
import getDeviceDataFirstItem from "./Providers/DeviceData/getDeviceDataFirstItem";
import getDeviceDataFirstInsert from "./Providers/DeviceData/getDeviceDataFirstInsert";
import getDeviceDataCount from "./Providers/DeviceData/getDeviceDataCount";
import getDeviceDataMax from "./Providers/DeviceData/getDeviceDataMax";
import getDeviceDataMin from "./Providers/DeviceData/getDeviceDataMin";
import getDeviceDataAvg from "./Providers/DeviceData/getDeviceDataAvg";
import getDeviceDataSum from "./Providers/DeviceData/getDeviceDataSum";
import addAnalysisLog from "./Providers/Analysis/addAnalysisLog";
import getAnalysisLogs from "./Providers/Analysis/getAnalysisLogs";
import deleteDeviceData from "./Providers/DeviceData/deleteDeviceData";
import setPluginStorageItem from "./Providers/PluginStorage/setPluginStorageItem";
import getAllPluginStorageItems from "./Providers/PluginStorage/getAllPluginStorageItem";
import getAccountAmount from "./Providers/Account/getAccountAmount";
import getAccountByToken from "./Providers/Account/getAccountByToken";
import getAccountByUsername from "./Providers/Account/getAccountByUsername";
import getAccountInfo from "./Providers/Account/getAccountInfo";
import getAccountList from "./Providers/Account/getAccountList";
import getAccountToken from "./Providers/Account/getAccountToken";
import getDeviceToken from "./Providers/Device/getDeviceToken";
import createAccount from "./Providers/Account/createAccount";
import createAccountToken from "./Providers/Account/createAccountToken";
import applyDeviceDataRetention from "./Providers/DeviceData/applyDeviceDataRetention";

export const postgreSQL = new DatabaseModule({
  id: "PostgreSQL",
  name: "PostgreSQL",
  configs,
});

postgreSQL.onLoad = setupKnex;
postgreSQL.onDestroy = destroyKnex;

postgreSQL.addAnalysisLog = addAnalysisLog;
postgreSQL.addDeviceData = addDeviceData;
postgreSQL.addStatistic = addStatistic;
postgreSQL.applyDeviceDataRetention = applyDeviceDataRetention;
postgreSQL.createAccount = createAccount;
postgreSQL.createAccountToken = createAccountToken;
postgreSQL.createAction = createAction;
postgreSQL.createAnalysis = createAnalysis;
postgreSQL.createDevice = createDevice;
postgreSQL.createDeviceToken = createDeviceToken;
postgreSQL.deleteAction = deleteAction;
postgreSQL.deleteAnalysis = deleteAnalysis;
postgreSQL.deleteAnalysisLogs = deleteAnalysisLogs;
postgreSQL.deleteDevice = deleteDevice;
postgreSQL.deleteDeviceData = deleteDeviceData;
postgreSQL.deleteDeviceParam = deleteDeviceParam;
postgreSQL.deleteDeviceToken = deleteDeviceToken;
postgreSQL.deletePluginStorageItem = deletePluginStorageItem;
postgreSQL.editAction = editAction;
postgreSQL.editAnalysis = editAnalysis;
postgreSQL.editDevice = editDevice;
postgreSQL.editDeviceData = editDeviceData;
postgreSQL.emptyDevice = emptyDevice;
postgreSQL.getAccountAmount = getAccountAmount;
postgreSQL.getAccountByToken = getAccountByToken;
postgreSQL.getAccountByUsername = getAccountByUsername;
postgreSQL.getAccountInfo = getAccountInfo;
postgreSQL.getAccountList = getAccountList;
postgreSQL.getAccountToken = getAccountToken;
postgreSQL.getActionInfo = getActionInfo;
postgreSQL.getActionList = getActionList;
postgreSQL.getAllPluginStorageItems = getAllPluginStorageItems;
postgreSQL.getAnalysisInfo = getAnalysisInfo;
postgreSQL.getAnalysisList = getAnalysisList;
postgreSQL.getAnalysisLogs = getAnalysisLogs;
postgreSQL.getDeviceByToken = getDeviceByToken;
postgreSQL.getDeviceDataAmount = getDeviceDataAmount;
postgreSQL.getDeviceDataAvg = getDeviceDataAvg;
postgreSQL.getDeviceDataCount = getDeviceDataCount;
postgreSQL.getDeviceDataDefaultQ = getDeviceDataDefaultQ;
postgreSQL.getDeviceDataFirstInsert = getDeviceDataFirstInsert;
postgreSQL.getDeviceDataFirstItem = getDeviceDataFirstItem;
postgreSQL.getDeviceDataFirstLocation = getDeviceDataFirstLocation;
postgreSQL.getDeviceDataFirstValue = getDeviceDataFirstValue;
postgreSQL.getDeviceDataLastInsert = getDeviceDataLastInsert;
postgreSQL.getDeviceDataLastItem = getDeviceDataLastItem;
postgreSQL.getDeviceDataLastLocation = getDeviceDataLastLocation;
postgreSQL.getDeviceDataLastValue = getDeviceDataLastValue;
postgreSQL.getDeviceDataMax = getDeviceDataMax;
postgreSQL.getDeviceDataMin = getDeviceDataMin;
postgreSQL.getDeviceDataSum = getDeviceDataSum;
postgreSQL.getDeviceInfo = getDeviceInfo;
postgreSQL.getDeviceList = getDeviceList;
postgreSQL.getDeviceParamList = getDeviceParamList;
postgreSQL.getDeviceToken = getDeviceToken;
postgreSQL.getDeviceTokenList = getDeviceTokenList;
postgreSQL.getHourlyStatistics = getHourlyStatistics;
postgreSQL.getPluginStorageItem = getPluginStorageItem;
postgreSQL.getSummary = getSummary;
postgreSQL.getTagKeys = getTagKeys;
postgreSQL.setDeviceParams = setDeviceParams;
postgreSQL.setPluginStorageItem = setPluginStorageItem;