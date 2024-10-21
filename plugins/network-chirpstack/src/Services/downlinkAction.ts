import { core } from "@tago-io/tcore-sdk";
import type { IDeviceData } from "@tago-io/tcore-sdk/build/Types";
import type { IConfigParam } from "../types.ts";
import downlinkService, { type IDownlinkParams } from "./downlink.ts";

class ResMockup {
  _status = 200;
  json(body: {}) {
    if (this._status >= 400) {
      console.error(body);
    }
    return this;
  }
  status(newStatus: number) {
    this._status = newStatus;
    return this;
  }
  jsonp() {
    return this;
  }
}

/**
 * Executed for Action downlink type.
 *
 * @param pluginConfig - Network plugin configuration
 * @param actionID - action ID that triggered the downlink
 * @param actionSettings - action settings that triggered the downlink
 * @param dataList - device data from the action
 */
async function downlinkAction(
  pluginConfig: IConfigParam,
  actionID: string,
  actionSettings: IDownlinkParams,
  dataList: IDeviceData
) {
  const action = await core.getActionInfo(actionID);

  if (Array.isArray(dataList) && dataList[0].variable) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const variables = action.trigger.conditions.map((condition: any) => condition.variable);
    const data = dataList.find((item) => variables.includes(item.variable));

    actionSettings.payload = actionSettings.payload.replace(/\$VALUE\$/g, data.value);
    actionSettings.payload = actionSettings.payload.replace(/\$VARIABLE\$/g, data.variable);
    actionSettings.payload = actionSettings.payload.replace(/\$SERIE\$/g, data.serie);

    if (actionSettings.device.toLowerCase() === "$device_id$") {
      const deviceInfo = await core.getDeviceInfo(data.origin);
      actionSettings.device = deviceInfo.id;
    }
  }

  // Any, so we don't need to replicate the full req object
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const reqMockup: any = {
    headers: {
      Authorization: pluginConfig.authorization_code,
    },
    body: {
      device: actionSettings.device,
      payload: actionSettings.payload,
      port: actionSettings.port,
      confirmed: actionSettings.confirmed,
    },
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await downlinkService(pluginConfig, reqMockup, new ResMockup() as any);
}

export default downlinkAction;
