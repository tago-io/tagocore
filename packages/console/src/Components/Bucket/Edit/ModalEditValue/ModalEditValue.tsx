import type { IDevice, IDeviceData } from "@tago-io/tcore-sdk/types";
import { useCallback, useState } from "react";
import editDeviceData from "../../../../Requests/editDeviceData.ts";
import { Col, FormGroup, Input, Modal, Row } from "../../../../index.ts";
import { EIcon } from "../../../Icon/Icon.types";
import Select from "../../../Select/Select.tsx";

/**
 * Props.
 */
interface IModalEditValueProps {
  /**
   * Device.
   */
  device: IDevice;
  /**
   * Data item to be edited.
   */
  data: IDeviceData;
  /**
   * Called when the modal closes.
   */
  onClose: () => void;
}

/**
 */
function ModalEditValue(props: IModalEditValueProps) {
  const { data, device, onClose } = props;
  const [value, setValue] = useState(() => {
    const v = data.value;
    const t = typeof data.value;
    if (t !== "string" && t !== "number" && t !== "boolean") {
      return "";
    }
    return String(v);
  });
  const [type, setType] = useState<string>(() => {
    const t = typeof data.value;
    if (t !== "string" && t !== "number" && t !== "boolean") {
      return "string";
    }
    return t;
  });

  /**
   */
  const confirm = useCallback(async () => {
    if (type === "string") {
      data.value = String(value);
    } else if (type === "number") {
      data.value = Number(value);
    } else if (type === "boolean") {
      data.value = value.trim() === "true" || value.trim() === "1";
    }
    await editDeviceData(device.id, data);
  }, [data, device?.id, type, value]);

  return (
    <Modal
      onClose={onClose}
      onCancel={onClose}
      onConfirm={confirm}
      title="Edit value"
      width="550px"
    >
      <Row>
        <Col size="6">
          <FormGroup
            addMarginBottom={false}
            icon={EIcon.cube}
            tooltip="Insert the value for this data item"
            label="Value"
          >
            <Input
              autoFocus
              onChange={(e) => setValue(e.target.value)}
              value={value}
              placeholder="Enter the value for the data item"
            />
          </FormGroup>
        </Col>

        <Col size="6">
          <FormGroup
            addMarginBottom={false}
            icon={EIcon.cube}
            tooltip="Insert the data type for this data item"
            label="Type"
          >
            <Select
              onChange={(e) => setType(e.target.value)}
              value={type}
              options={[
                { label: "String", value: "string" },
                { label: "Boolean", value: "boolean" },
                { label: "Number", value: "number" },
              ]}
            />
          </FormGroup>
        </Col>
      </Row>
    </Modal>
  );
}

export default ModalEditValue;
