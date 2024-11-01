import type { IDevice, ITag } from "@tago-io/tcore-sdk/types";
import { useTheme } from "styled-components";
import Col from "../../../../Col/Col.tsx";
import DevicePicker from "../../../../Device/Common/DevicePicker/DevicePicker.tsx";
import FlexRow from "../../../../FlexRow/FlexRow.tsx";
import FormGroup from "../../../../FormGroup/FormGroup.tsx";
import { EIcon } from "../../../../Icon/Icon.types";
import IconRadio from "../../../../IconRadio/IconRadio.tsx";
import Input from "../../../../Input/Input.tsx";
import Row from "../../../../Row/Row.tsx";

/**
 * Props.
 */
interface IDeviceRadioProps {
  /**
   * Selected device if type = `single`.
   */
  device?: IDevice;
  /**
   * Selected tag if type = `multiple`.
   */
  tag?: ITag;
  /**
   * Type of selection.
   */
  deviceType: "single" | "multiple";
  /**
   * Called when the device changes.
   */
  onChangeDevice: (device: IDevice) => void;
  /**
   * Called when the tag changes.
   */
  onChangeTag: (tag: ITag) => void;
  /**
   * Called when the type changes.
   */
  onChangeDeviceType: (type: string) => void;
  /**
   * Indicates if this device radio has an error.
   */
  errors?: any;
}

/**
 * An input radio to select types of devices.
 */
function DeviceRadio(props: IDeviceRadioProps) {
  const {
    deviceType,
    errors,
    device,
    tag,
    onChangeDeviceType,
    onChangeTag,
    onChangeDevice,
  } = props;

  const theme = useTheme();

  return (
    <Row>
      <Col size="6">
        <FormGroup>
          <IconRadio
            value={deviceType}
            onChange={onChangeDeviceType}
            options={[
              {
                label: "Single device",
                value: "single",
                icon: EIcon.device,
                color: deviceType === "single" ? theme.action : theme.font,
                description: "Watch a single device.",
              },
              {
                label: "Multiple devices",
                value: "multiple",
                icon: EIcon["device-union"],
                color: deviceType === "multiple" ? theme.action : theme.font,
                description: "Watch all devices with matching tags.",
              },
            ]}
          />
        </FormGroup>
      </Col>

      <Col size="6">
        {deviceType === "single" ? (
          <FormGroup
            icon={EIcon.device}
            label="Select the device"
            tooltip="Only the variables of this device will be watched."
          >
            <DevicePicker
              error={errors?.device}
              value={device}
              onChange={onChangeDevice}
            />
          </FormGroup>
        ) : (
          <FormGroup
            icon={EIcon.tag}
            label="Select the tags of the devices"
            tooltip="All devices with these tags (key & value) will be watched."
          >
            <FlexRow>
              <Input
                value={tag?.key || ""}
                onChange={(e) =>
                  onChangeTag({ key: e.target.value, value: tag?.value || "" })
                }
                placeholder="Enter a tag key"
                error={errors?.tag}
              />
              <Input
                value={tag?.value || ""}
                onChange={(e) =>
                  onChangeTag({ key: tag?.key || "", value: e.target.value })
                }
                placeholder="Tag value"
                error={errors?.tag}
              />
            </FlexRow>
          </FormGroup>
        )}
      </Col>
    </Row>
  );
}

export default DeviceRadio;
