import type {
  IAccount,
  IAccountList,
  IAccountToken,
  IAction,
  IActionList,
  IAnalysis,
  IAnalysisList,
  IDatabaseAccountCreateTokenData,
  IDatabaseAccountListQuery,
  IDatabaseActionListQuery,
  IDatabaseAddAnalysisLogData,
  IDatabaseAddStatisticData,
  IDatabaseAnalysisListQuery,
  IDatabaseCreateAccountData,
  IDatabaseCreateActionData,
  IDatabaseCreateAnalysisData,
  IDatabaseCreateDeviceData,
  IDatabaseCreateDeviceTokenData,
  IDatabaseDeviceDataCreate,
  IDatabaseDeviceDataEdit,
  IDatabaseDeviceListQuery,
  IDatabaseEditActionData,
  IDatabaseEditAnalysisData,
  IDatabaseEditDeviceData,
  IDatabaseGetDeviceDataQuery,
  IDatabaseGetDeviceTokenListQuery,
  IDatabaseSetDeviceParamsData,
  IDatabaseSetPluginStorageData,
  IDevice,
  IDeviceApplyDataRetentionQuery,
  IDeviceData,
  IDeviceList,
  IDeviceParameter,
  IDeviceToken,
  IDeviceTokenList,
  ILog,
  IModuleSetupWithoutType,
  IStatistic,
  ISummary,
  TDatabaseGetTagKeysType,
  TDeviceType,
  TGenericID,
  TGenericToken,
} from "../../Types.ts";
import TCoreModule from "../TCoreModule/TCoreModule.ts";

/**
 * This module allows the creation of a new database connection.
 */
class DatabaseModule extends TCoreModule {
  constructor(protected setup: IModuleSetupWithoutType) {
    super(setup, "database");
  }

  /**
   * Adds data into a device.
   */
  public async addDeviceData(
    deviceID: TGenericID,
    type: TDeviceType,
    data: IDatabaseDeviceDataCreate[],
  ): Promise<void> {
    throw new Error("Method not implemented");
  }

  /**
   * Edits a device data point.
   */
  public async editDeviceData(
    deviceID: TGenericID,
    type: TDeviceType,
    data: IDatabaseDeviceDataEdit[],
  ): Promise<void> {
    throw new Error("Method not implemented");
  }

  /**
   * Deletes data from a device.
   */
  public async deleteDeviceData(
    deviceID: TGenericID,
    type: TDeviceType,
    ids: string[],
  ): Promise<void> {
    throw new Error("Method not implemented");
  }

  /**
   * Applies data retention for a device by deleting all old data.
   */
  public async applyDeviceDataRetention(
    deviceID: TGenericID,
    type: TDeviceType,
    query: IDeviceApplyDataRetentionQuery,
  ): Promise<void> {
    throw new Error("Method not implemented");
  }

  /**
   * Retrieves data from a device using the default query.
   */
  public async getDeviceDataDefaultQ(
    deviceID: TGenericID,
    type: TDeviceType,
    query: IDatabaseGetDeviceDataQuery,
  ): Promise<IDeviceData[]> {
    throw new Error("Method not implemented");
  }

  /**
   * Retrieves from a device the last data item that contains a value.
   */
  public async getDeviceDataLastValue(
    deviceID: TGenericID,
    type: TDeviceType,
    query: IDatabaseGetDeviceDataQuery,
  ): Promise<IDeviceData[]> {
    throw new Error("Method not implemented");
  }

  /**
   * Retrieves from a device the last data item that contains a location.
   */
  public async getDeviceDataLastLocation(
    deviceID: TGenericID,
    type: TDeviceType,
    query: IDatabaseGetDeviceDataQuery,
  ): Promise<IDeviceData[]> {
    throw new Error("Method not implemented");
  }

  /**
   * Retrieves from a device the last data item sorted by descending `time`.
   */
  public async getDeviceDataLastItem(
    deviceID: TGenericID,
    type: TDeviceType,
    query: IDatabaseGetDeviceDataQuery,
  ): Promise<IDeviceData[]> {
    throw new Error("Method not implemented");
  }

  /**
   * Retrieves from a device the last data item sorted by descending `created_at`.
   */
  public async getDeviceDataLastInsert(
    deviceID: TGenericID,
    type: TDeviceType,
    query: IDatabaseGetDeviceDataQuery,
  ): Promise<IDeviceData[]> {
    throw new Error("Method not implemented");
  }

  /**
   * Retrieves from a device the first data item that contains a value.
   */
  public async getDeviceDataFirstValue(
    deviceID: TGenericID,
    type: TDeviceType,
    query: IDatabaseGetDeviceDataQuery,
  ): Promise<IDeviceData[]> {
    throw new Error("Method not implemented");
  }

  /**
   * Retrieves from a device the first data item that contains a location.
   */
  public async getDeviceDataFirstLocation(
    deviceID: TGenericID,
    type: TDeviceType,
    query: IDatabaseGetDeviceDataQuery,
  ): Promise<IDeviceData[]> {
    throw new Error("Method not implemented");
  }

  /**
   * Retrieves from a device the first data item sorted by descending `time`.
   */
  public async getDeviceDataFirstItem(
    deviceID: TGenericID,
    type: TDeviceType,
    query: IDatabaseGetDeviceDataQuery,
  ): Promise<IDeviceData[]> {
    throw new Error("Method not implemented");
  }

  /**
   * Retrieves from a device the first data item sorted by descending `created_at`.
   */
  public async getDeviceDataFirstInsert(
    deviceID: TGenericID,
    type: TDeviceType,
    query: IDatabaseGetDeviceDataQuery,
  ): Promise<IDeviceData[]> {
    throw new Error("Method not implemented");
  }

  /**
   * Retrieves a custom count of the amount of data in a device.
   */
  public async getDeviceDataCount(
    deviceID: TGenericID,
    type: TDeviceType,
    query: IDatabaseGetDeviceDataQuery,
  ): Promise<number> {
    throw new Error("Method not implemented");
  }

  /**
   * Retrieves the item with the biggest value in a device.
   */
  public async getDeviceDataMax(
    deviceID: TGenericID,
    type: TDeviceType,
    query: IDatabaseGetDeviceDataQuery,
  ): Promise<IDeviceData[]> {
    throw new Error("Method not implemented");
  }

  /**
   * Retrieves the item with the lowest value in a device.
   */
  public async getDeviceDataMin(
    deviceID: TGenericID,
    type: TDeviceType,
    query: IDatabaseGetDeviceDataQuery,
  ): Promise<IDeviceData[]> {
    throw new Error("Method not implemented");
  }

  /**
   * Retrieves the average value of all items in a device.
   */
  public async getDeviceDataAvg(
    deviceID: TGenericID,
    type: TDeviceType,
    query: IDatabaseGetDeviceDataQuery,
  ): Promise<number> {
    throw new Error("Method not implemented");
  }

  /**
   * Retrieves the sum of all items in a device.
   */
  public async getDeviceDataSum(
    deviceID: TGenericID,
    type: TDeviceType,
    query: IDatabaseGetDeviceDataQuery,
  ): Promise<number> {
    throw new Error("Method not implemented");
  }

  /**
   * Retrieves a list of devices.
   * Additional filters can be passed via the query argument.
   */
  public async getDeviceList(
    query: IDatabaseDeviceListQuery,
  ): Promise<IDeviceList> {
    throw new Error("Method not implemented");
  }

  /**
   * Retrieves all the information of a single device.
   */
  public async getDeviceInfo(deviceID: TGenericID): Promise<IDevice | null> {
    throw new Error("Method not implemented");
  }

  /**
   * Edits the information of a single device.
   */
  public async editDevice(
    deviceID: TGenericID,
    data: IDatabaseEditDeviceData,
  ): Promise<void> {
    throw new Error("Method not implemented");
  }

  /**
   * Deletes a device.
   */
  public async deleteDevice(deviceID: TGenericID): Promise<void> {
    throw new Error("Method not implemented");
  }

  /**
   * Creates a new device.
   */
  public async createDevice(data: IDatabaseCreateDeviceData): Promise<void> {
    throw new Error("Method not implemented");
  }

  /**
   * Retrieves all the information of a single device via its token.
   */
  public async getDeviceByToken(token: TGenericToken): Promise<IDevice | null> {
    throw new Error("Method not implemented");
  }

  /**
   * Generates and retrieves a new device token.
   */
  public async createDeviceToken(
    deviceID: TGenericID,
    data: IDatabaseCreateDeviceTokenData,
  ): Promise<void> {
    throw new Error("Method not implemented");
  }

  /**
   * Retrieves a list of device tokens.z
   * Additional filters can be passed via the query argument.
   */
  public async getDeviceTokenList(
    deviceID: TGenericID,
    query: IDatabaseGetDeviceTokenListQuery,
  ): Promise<IDeviceTokenList> {
    throw new Error("Method not implemented");
  }

  /**
   * Deletes a device's token.
   */
  public async deleteDeviceToken(token: TGenericToken): Promise<void> {
    throw new Error("Method not implemented");
  }

  /**
   * Gets all the parameters of a device.
   */
  public async getDeviceParamList(
    deviceID: TGenericID,
    sentStatus?: boolean,
  ): Promise<IDeviceParameter[]> {
    throw new Error("Method not implemented");
  }

  /**
   * Deletes a device's param.
   */
  public async deleteDeviceParam(deviceID: TGenericID): Promise<void> {
    throw new Error("Method not implemented");
  }

  /**
   * Overrides the device parameters.
   */
  public async setDeviceParams(
    deviceID: TGenericID,
    data: IDatabaseSetDeviceParamsData[],
  ): Promise<void> {
    throw new Error("Method not implemented");
  }

  /**
   * Retrieves the amount of data in a device.
   */
  public async getDeviceDataAmount(
    deviceID: TGenericID,
    type: TDeviceType,
  ): Promise<number> {
    throw new Error("Method not implemented");
  }

  /**
   * Empties a device.
   */
  public async emptyDevice(
    deviceID: TGenericID,
    type: TDeviceType,
  ): Promise<void> {
    throw new Error("Method not implemented");
  }

  /**
   * Retrieves the token info of a particular uuid.
   */
  public async getDeviceToken(
    token: TGenericToken,
  ): Promise<IDeviceToken | null> {
    throw new Error("Method not implemented");
  }

  /**
   * Retrieves a list of actions.
   */
  public async getActionList(
    query: IDatabaseActionListQuery,
  ): Promise<IActionList> {
    throw new Error("Method not implemented");
  }

  /**
   * Retrieves all the information of an action.
   */
  public async getActionInfo(actionID: TGenericID): Promise<IAction | null> {
    throw new Error("Method not implemented");
  }

  /**
   * Edits the information of a single action.
   */
  public async editAction(
    actionID: TGenericID,
    data: IDatabaseEditActionData,
  ): Promise<void> {
    throw new Error("Method not implemented");
  }

  /**
   * Deletes an action.
   */
  public async deleteAction(actionID: TGenericID): Promise<void> {
    throw new Error("Method not implemented");
  }

  /**
   * Creates a new action.
   */
  public async createAction(query: IDatabaseCreateActionData): Promise<void> {
    throw new Error("Method not implemented");
  }

  /**
   * Retrieves a list of analyses.
   */
  public async getAnalysisList(
    query: IDatabaseAnalysisListQuery,
  ): Promise<IAnalysisList> {
    throw new Error("Method not implemented");
  }

  /**
   * Retrieves all the information of an analysis.
   */
  public async getAnalysisInfo(
    analysisID: TGenericID,
  ): Promise<IAnalysis | null> {
    throw new Error("Method not implemented");
  }

  /**
   * Edits the information of a single analysis.
   */
  public async editAnalysis(
    analysisID: TGenericID,
    data: IDatabaseEditAnalysisData,
  ): Promise<void> {
    throw new Error("Method not implemented");
  }

  /**
   * Deletes a analysis.
   */
  public async deleteAnalysis(analysisID: TGenericID): Promise<void> {
    throw new Error("Method not implemented");
  }

  /**
   * Deletes all logs of an analysis.
   */
  public async deleteAnalysisLogs(analysisID: TGenericID): Promise<void> {
    throw new Error("Method not implemented");
  }

  /**
   * Creates a new analysis.
   */
  public async createAnalysis(
    data: IDatabaseCreateAnalysisData,
  ): Promise<void> {
    throw new Error("Method not implemented");
  }

  /**
   * Creates/adds a new log for an analysis.
   */
  public async addAnalysisLog(
    analysisID: TGenericID,
    data: IDatabaseAddAnalysisLogData,
  ): Promise<void> {
    throw new Error("Method not implemented");
  }

  /**
   * Retrieves all the logs of an analysis.
   */
  public async getAnalysisLogs(analysisID: TGenericID): Promise<ILog[]> {
    throw new Error("Method not implemented");
  }

  /**
   * Retrieves the summary information.
   */
  public async getSummary(): Promise<ISummary> {
    throw new Error("Method not implemented");
  }

  /**
   * Retrieves a storage item of a plugin.
   */
  public async getPluginStorageItem(
    pluginID: string,
    key: string,
  ): Promise<any | undefined> {
    throw new Error("Method not implemented");
  }

  /**
   * Retrieves all storage item of a plugin.
   */
  public async getAllPluginStorageItems(pluginID: string): Promise<any[]> {
    throw new Error("Method not implemented");
  }

  /**
   * Creates/edits a storage item of a plugin.
   */
  public async setPluginStorageItem(
    pluginID: string,
    data: IDatabaseSetPluginStorageData,
  ): Promise<void> {
    throw new Error("Method not implemented");
  }

  /**
   * Deletes a storage item of a plugin.
   */
  public async deletePluginStorageItem(
    pluginID: string,
    key: string,
  ): Promise<void> {
    throw new Error("Method not implemented");
  }

  /**
   * Retrieves all the tag keys of a resource type.
   */
  public async getTagKeys(type: TDatabaseGetTagKeysType): Promise<string[]> {
    throw new Error("Method not implemented");
  }

  /**
   * Adds a statistic.
   */
  public async addStatistic(
    isoTime: string,
    data: IDatabaseAddStatisticData,
  ): Promise<void> {
    throw new Error("Method not implemented");
  }

  /**
   * Retrieves all statistics from the last hour.
   */
  public async getHourlyStatistics(): Promise<IStatistic[]> {
    throw new Error("Method not implemented");
  }

  /**
   * Generates and retrieves a new account token.
   */
  public async createAccountToken(
    accountID: TGenericID,
    data: IDatabaseAccountCreateTokenData,
  ): Promise<void> {
    throw new Error("Method not implemented");
  }

  /**
   * Retrieves all the information of a single account.
   */
  public async getAccountInfo(id: string): Promise<IAccount | null> {
    throw new Error("Method not implemented");
  }

  /**
   * Retrieves all the information of a single account via its token.
   */
  public async getAccountByToken(token: string): Promise<IAccount | null> {
    throw new Error("Method not implemented");
  }

  /**
   * Retrieves all the information of a single account via its username.
   */
  public async getAccountByUsername(
    username: string,
  ): Promise<IAccount | null> {
    throw new Error("Method not implemented");
  }

  /**
   * Creates a new account.
   */
  public async createAccount(data: IDatabaseCreateAccountData): Promise<void> {
    throw new Error("Method not implemented");
  }

  /**
   * Retrieves a list of accounts.
   */
  public async getAccountList(
    query: IDatabaseAccountListQuery,
  ): Promise<IAccountList> {
    throw new Error("Method not implemented");
  }

  /**
   * Retrieves the token info of a particular uuid.
   */
  public async getAccountToken(
    token: TGenericToken,
  ): Promise<IAccountToken | null> {
    throw new Error("Method not implemented");
  }

  /**
   * Retrieves the amount of accounts registered.
   */
  public async getAccountAmount(): Promise<number> {
    throw new Error("Method not implemented");
  }

  /**
   * Export the Device data to a CSV file
   */
  public async exportDeviceData(
    deviceID: TGenericID,
    type: TDeviceType,
    folder: string,
  ): Promise<string> {
    throw new Error("Method not implemented");
  }

  /**
   * Import Device data from a CSV file
   */
  public async importDeviceData(
    deviceID: TGenericID,
    type: TDeviceType,
    folder: string,
  ): Promise<string> {
    throw new Error("Method not implemented");
  }
}

export default DatabaseModule;
