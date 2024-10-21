import { useCallback } from "react";
import { useTheme } from "styled-components";
import getDeviceTypeName from "../../../../Helpers/getDeviceTypeName.ts";
import Icon from "../../../Icon/Icon.tsx";
import { EIcon } from "../../../Icon/Icon.types";
import OptionsPicker from "../../../OptionsPicker/OptionsPicker.tsx";
import * as Style from "./DeviceTypePicker.style";

/**
 * Props.
 */
interface IDeviceTypePicker {
  /**
   * Device type object.
   */
  value?: any;
  /**
   * Called when a new device type gets picked.
   */
  onChange: (value: any) => void;
  /**
   * Indicates if this component has invalid data.
   * If this is set to `true`, this component will get a red border.
   */
  error?: boolean;
}

/**
 * Options to be displayed in the component.
 */
const defaultOptions: any[] = [
  {
    description: "Recommended for huge amounts of device and sensor data",
    icon: EIcon.mountain,
    id: "immutable",
    name: getDeviceTypeName("immutable"),
  },
  {
    description: "Recommended for small amounts of data that can change",
    icon: EIcon.cubes,
    id: "mutable",
    name: getDeviceTypeName("mutable"),
  },
];

/**
 * Picker for the type of devices.
 */
function DeviceTypePicker(props: IDeviceTypePicker) {
  const { error } = props;
  const theme = useTheme();

  /**
   * Renders a single row.
   */
  const renderOption = (item: any) => {
    return (
      <Style.Item>
        <div className="content">
          <div className="icon-container">
            <Icon icon={item.icon} color={theme.device} size="25px" />
          </div>

          <div className="info">
            <div className="title">{item.name}</div>
            <div className="description">{item.description}</div>
          </div>
        </div>
      </Style.Item>
    );
  };

  /**
   * Resolves an option by an ID.
   * This transforms the ID into an object.
   */
  const resolveOptionByID = useCallback(async (id: string | number) => {
    const response = defaultOptions.find((x) => x.id === id);
    return response;
  }, []);

  /**
   * Retrieves the options.
   */
  const onGetOptions = useCallback((query: string, page: number) => {
    if (page > 1) {
      return [];
    }

    return defaultOptions.filter((x) => {
      return (
        String(x.description).toLowerCase().includes(query) ||
        String(x.name).toLowerCase().includes(query)
      );
    });
  }, []);

  return (
    <OptionsPicker<any>
      doesRequest
      labelField="name"
      onChange={props.onChange}
      onGetOptions={onGetOptions}
      onRenderOption={renderOption}
      onResolveOption={resolveOptionByID}
      error={error}
      value={props.value}
    />
  );
}

export default DeviceTypePicker;
