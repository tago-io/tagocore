import type { IDevice, IDeviceData } from "@tago-io/tcore-sdk/types";
import { useCallback, useState } from "react";
import editDeviceData from "../../../../Requests/editDeviceData.ts";
import { FormGroup, Input, Modal } from "../../../../index.ts";
import { EIcon } from "../../../Icon/Icon.types";
import * as Style from "./ModalEditGroup.style";

interface ModalEditGroupProps {
  device: IDevice;
  data: IDeviceData;
  onClose: () => void;
}

export function ModalEditGroup(props: ModalEditGroupProps) {
  const { data, device, onClose } = props;
  const [value, setValue] = useState(() => String(data.group || ""));

  const confirm = useCallback(async () => {
    data.group = String(value);
    await editDeviceData(device.id, data);
  }, [value, device?.id, data]);

  return (
    <Modal
      onClose={onClose}
      onCancel={onClose}
      onConfirm={confirm}
      title="Edit group"
      width="400px"
    >
      <FormGroup
        addMarginBottom={false}
        icon={EIcon.cube}
        tooltip="Insert the group for this data item"
        label="Group"
      >
        <div style={{ position: "relative" }}>
          <Input
            autoFocus
            onChange={(e) => setValue(e.target.value.substring(0, 24))}
            value={value}
            placeholder="Enter the group for the data item"
            spellCheck="false"
          />
          <Style.Characters>{String(value).length} / 24</Style.Characters>
        </div>
      </FormGroup>
    </Modal>
  );
}
