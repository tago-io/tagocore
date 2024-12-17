import type { IDevice, TGenericID } from "@tago-io/tcore-sdk/types";
import { useCallback } from "react";
import getDeviceInfo from "../../../../Requests/getDeviceInfo.ts";
import getDeviceList from "../../../../Requests/getDeviceList.ts";
import OptionsPicker from "../../../OptionsPicker/OptionsPicker.tsx";

interface IDevicePicker {
  /** Selected Device object. */
  value: IDevice | undefined;
  error?: boolean;
  onChange: (value: IDevice) => void;
}

function DevicePicker(props: IDevicePicker) {
  const { value, error } = props;

  const onGetOptions = useCallback(async (query: string, page: number) => {
    const devices = await getDeviceList(page, 20, query);
    return devices;
  }, []);

  const resolveOptionByID = useCallback(async (id: string | number) => {
    const device = await getDeviceInfo(id as TGenericID);
    return device;
  }, []);

  const renderOption = useCallback((device: IDevice) => {
    return device.name;
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
