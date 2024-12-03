import type {
  IAction,
  IActionCreate,
  IActionEdit,
  IActionList,
  IActionListQuery,
  IActionOption,
  IAnalysis,
  IAnalysisCreate,
  IAnalysisEdit,
  IAnalysisList,
  IAnalysisListQuery,
  ICreateDeviceResponse,
  IDevice,
  IDeviceCreate,
  IDeviceData,
  IDeviceDataQuery,
  IDeviceEdit,
  IDeviceList,
  IDeviceListQuery,
  IDeviceParameter,
  IDeviceParameterCreate,
  IDeviceToken,
  IDeviceTokenCreate,
  IDeviceTokenCreateResponse,
  IDeviceTokenListQuery,
  ILiveInspectorMessageCreate,
  ISummary,
  TGenericID,
  TGenericToken,
  TLiveInspectorConnectionID,
} from "../../Types/index.ts";
import APIBridge from "../APIBridge/APIBridge.ts";

/**
 * Class to manage communication between a plugin and the API.
 */
class Core extends APIBridge {
  /**
   * Retrieves a list of devices.
   * Additional filters can be passed via the query argument.
   */
  public async getDeviceList(query?: IDeviceListQuery): Promise<IDeviceList> {
    const response = await this.invokeApiMethod("getDeviceList", query);
    return response;
  }

  /**
   * Retrieves all the information of a single device.
   */
  public async getDeviceInfo(id: TGenericID): Promise<IDevice> {
    const response = await this.invokeApiMethod("getDeviceInfo", id);
    return response;
  }

  /**
   * Retrieves all the information of a single device via its token.
   */
  public async getDeviceByToken(token: TGenericToken): Promise<IDevice> {
    const response = await this.invokeApiMethod("getDeviceByToken", token);
    return response;
  }

  /**
   * Edits the information of a single device.
   */
  public async editDevice(id: TGenericID, device: IDeviceEdit): Promise<void> {
    await this.invokeApiMethod("editDevice", id, device);
  }

  /**
   * Deletes a device.
   */
  public async deleteDevice(id: TGenericID): Promise<void> {
    await this.invokeApiMethod("deleteDevice", id);
  }

  /**
   * Creates a new device.
   */
  public async createDevice(
    params: Omit<IDeviceCreate, "id" | "created_at">,
  ): Promise<ICreateDeviceResponse> {
    const response = await this.invokeApiMethod("createDevice", params);
    return response;
  }

  /**
   * Generates and retrieves a new device token.
   */
  public async createDeviceToken(
    deviceID: TGenericID,
    token: Omit<IDeviceTokenCreate, "token" | "created_at">,
  ): Promise<IDeviceTokenCreateResponse> {
    const response = await this.invokeApiMethod(
      "createDeviceToken",
      deviceID,
      token,
    );
    return response;
  }

  /**
   * Retrieves a list of device tokens.
   * Additional filters can be passed via the query argument.
   */
  public async getDeviceTokenList(
    deviceID: TGenericID,
    query?: IDeviceTokenListQuery,
  ): Promise<IDeviceToken[]> {
    const response = await this.invokeApiMethod(
      "getDeviceTokenList",
      deviceID,
      query,
    );
    return response;
  }

  /**
   * Deletes a device's token.
   */
  public async deleteDeviceToken(token: TGenericToken): Promise<void> {
    await this.invokeApiMethod("deleteDeviceToken", token);
  }

  /**
   * Gets all the parameters of a device.
   */
  public async getDeviceParamList(
    deviceID: TGenericID,
    sentStatus?: boolean,
  ): Promise<IDeviceParameter[]> {
    const response = await this.invokeApiMethod(
      "getDeviceParamList",
      deviceID,
      sentStatus,
    );
    return response;
  }

  /**
   * Deletes a device's param.
   */
  public async deleteDeviceParam(id: TGenericID): Promise<void> {
    await this.invokeApiMethod("deleteDeviceParam", id);
  }

  /**
   * Overrides or edits device parameters. If you want to edit a device parameter, pass the ID
   * property inside of an object in the array.
   */
  public async setDeviceParams(
    deviceID: TGenericID,
    parameters: IDeviceParameterCreate[],
  ): Promise<void> {
    await this.invokeApiMethod("setDeviceParams", deviceID, parameters);
  }

  /**
   * Retrieves the amount of data in a device.
   */
  public async getDeviceDataAmount(id: TGenericID): Promise<number> {
    const response = await this.invokeApiMethod("getDeviceDataAmount", id);
    return response;
  }

  /**
   * Retrieves a list of all action options.
   */
  public async getActionTypes(): Promise<IActionOption[]> {
    const response = await this.invokeApiMethod("getActiontypes.ts");
    return response;
  }

  /**
   * Retrieves a list of actions.
   * Additional filters can be passed via the query argument.
   */
  public async getActionList(query?: IActionListQuery): Promise<IActionList> {
    const response = await this.invokeApiMethod("getActionList", query);
    return response;
  }

  /**
   * Retrieves all the information of a single action.
   */
  public async getActionInfo(id: TGenericID): Promise<IAction> {
    const response = await this.invokeApiMethod("getActionInfo", id);
    return response;
  }

  /**
   * Edits the information of a single action.
   */
  public async editAction(id: TGenericID, action: IActionEdit): Promise<void> {
    const response = await this.invokeApiMethod("editAction", id, action);
    return response;
  }

  /**
   * Deletes a action.
   */
  public async deleteAction(id: TGenericID): Promise<void> {
    await this.invokeApiMethod("deleteAction", id);
  }

  /**
   * Creates a new action.
   */
  public async createAction(
    params: Omit<IActionCreate, "id" | "created_at">,
  ): Promise<TGenericID> {
    const response = await this.invokeApiMethod("createAction", params);
    return response;
  }

  /**
   * Triggers an action.
   */
  public async triggerAction(id: TGenericID, data?: any): Promise<void> {
    const response = await this.invokeApiMethod("triggerAction", id, data);
    return response;
  }

  /**
   * Retrieves a list of analyses.
   * Additional filters can be passed via the query argument.
   */
  public async getAnalysisList(
    query?: IAnalysisListQuery,
  ): Promise<IAnalysisList> {
    const response = await this.invokeApiMethod("getAnalysisList", query);
    return response;
  }

  /**
   * Retrieves all the information of a single analysis.
   */
  public async getAnalysisInfo(id: TGenericID): Promise<IAnalysis> {
    const response = await this.invokeApiMethod("getAnalysisInfo", id);
    return response;
  }

  /**
   * Edits the information of a single analysis.
   */
  public async editAnalysis(
    id: TGenericID,
    analysis: IAnalysisEdit,
  ): Promise<void> {
    const response = await this.invokeApiMethod("editAnalysis", id, analysis);
    return response;
  }

  /**
   * Deletes a analysis.
   */
  public async deleteAnalysis(id: TGenericID): Promise<void> {
    await this.invokeApiMethod("deleteAnalysis", id);
  }

  /**
   * Creates a new analysis.
   */
  public async createAnalysis(
    params: Omit<IAnalysisCreate, "id" | "created_at">,
  ): Promise<TGenericID> {
    const response = await this.invokeApiMethod("createAnalysis", params);
    return response;
  }

  /**
   * Retrieves the summary information.
   */
  public async getSummary(): Promise<ISummary> {
    const response = await this.invokeApiMethod("getSummary");
    return response;
  }

  /**
   * Adds a data item into a device.
   */
  public async addDeviceData(
    deviceID: TGenericID,
    data: any,
    options?: { forceDBInsert: boolean },
  ): Promise<void> {
    await this.invokeApiMethod("addDeviceData", deviceID, data, options);
  }

  /**
   * Retrieves data from a device.
   * Additional filters can be passed via the query argument.
   */
  public async getDeviceData(
    deviceID: TGenericID,
    query?: IDeviceDataQuery,
  ): Promise<IDeviceData[]> {
    const response = await this.invokeApiMethod(
      "getDeviceData",
      deviceID,
      query,
    );
    return response;
  }

  /**
   * Retrieves all the tag keys of a resource type.
   */
  public async getTagKeys(
    type: "device" | "analysis" | "action",
  ): Promise<string[]> {
    const response = await this.invokeApiMethod("getTagKeys", type);
    return response;
  }

  /**
   * Retrieves all the tag keys of a resource type.
   */
  public async emitToLiveInspector(
    deviceID: TGenericID,
    msg: ILiveInspectorMessageCreate | ILiveInspectorMessageCreate[],
    liveInspectorID?: TLiveInspectorConnectionID,
  ): Promise<void> {
    await this.invokeApiMethod(
      "emitToLiveInspector",
      deviceID,
      msg,
      liveInspectorID,
    );
  }
}

const instance = new Core();
export default instance;
