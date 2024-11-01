import type { IDevice, IDeviceData } from "@tago-io/tcore-sdk/types";
import { useCallback, useState } from "react";
import editDeviceData from "../../../../Requests/editDeviceData.ts";
import { FormGroup, Modal } from "../../../../index.ts";
import { EIcon } from "../../../Icon/Icon.types";
import * as Style from "./ModalEditMetadata.style";

/**
 * Props.
 */
interface IModalEditMetadataProps {
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
function ModalEditMetadata(props: IModalEditMetadataProps) {
  const { data, device, onClose } = props;
  const [value, setValue] = useState(() =>
    data.metadata ? JSON.stringify(data.metadata, null, 2) : "",
  );

  /**
   */
  const confirm = useCallback(async () => {
    data.metadata = JSON.parse(value);
    await editDeviceData(device.id, data);
  }, [value, device?.id, data]);

  let validJSON = true;
  try {
    JSON.parse(value);
    validJSON = true;
  } catch (ex) {
    validJSON = false;
  }

  return (
    <Modal
      onClose={onClose}
      onCancel={onClose}
      onConfirm={confirm}
      title="Edit metadata"
      width="550px"
      isConfirmButtonDisabled={!validJSON}
    >
      <FormGroup
        addMarginBottom={false}
        icon={EIcon.cube}
        tooltip="Insert the group for this data item"
        label="Metadata"
      >
        <Style.TextArea
          autoFocus
          onChange={(e) => setValue(e.target.value)}
          placeholder="Insert a valid JSON"
          value={value}
        />
      </FormGroup>
    </Modal>
  );
}

export default ModalEditMetadata;
