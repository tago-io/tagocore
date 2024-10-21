import type { IDevice, TGenericID } from "@tago-io/tcore-sdk/types";
import { useCallback } from "react";
import getDeviceInfo from "../../../../Requests/getDeviceInfo.ts";
import getDeviceList from "../../../../Requests/getDeviceList.ts";
import OptionsPicker from "../../../OptionsPicker/OptionsPicker.tsx";

/**
 * Props.
 */
interface IDevicePicker {
  /**
   * Device object.
   */
  value?: IDevice;
  /**
   * Called when a new device gets picked.
   */
  onChange: (value: IDevice) => void;
  /**
   * Indicates if this component has invalid data.
   * If this is set to `true`, this component will get a red border.
   */
  error?: boolean;
}

/**
 */
function DevicePicker(props: IDevicePicker) {
  const { value, error } = props;

  /**
   * Retrieves the options.
   */
  const onGetOptions = useCallback(async (query: string, page: number) => {
    const devices = await getDeviceList(page, 20, query);
    return devices;
  }, []);

  /**
   * Resolves an option by an ID.
   * This transforms the ID into an object.
   */
  const resolveOptionByID = useCallback(async (id: string | number) => {
    const device = await getDeviceInfo(id as TGenericID);
    return device;
  }, []);

  /**
   * Renders a single option row.
   */
  const renderOption = useCallback((i) => {
    return i.name;
  }, []);

  return (
    <OptionsPicker<IDevice>
      doesRequest
      error={error}
      labelField="name"
      onChange={props.onChange}
      onGetOptions={onGetOptions}
      onRenderOption={renderOption}
      onResolveOption={resolveOptionByID}
      placeholder="Select a device"
      value={value}
    />
  );
}

export default DevicePicker;
