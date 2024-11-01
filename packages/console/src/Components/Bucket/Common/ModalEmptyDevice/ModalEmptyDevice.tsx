import { useState } from "react";
import FormGroup from "../../../FormGroup/FormGroup.tsx";
import Input from "../../../Input/Input.tsx";
import Modal from "../../../Modal/Modal.tsx";

/**
 * Props.
 */
interface IModalEmptyDeviceProps {
  /**
   */
  onClose: () => void;
  /**
   */
  onConfirm: () => Promise<void>;
}

/**
 */
function ModalEmptyDevice(props: IModalEmptyDeviceProps) {
  const [value, setValue] = useState("");
  const { onConfirm, onClose } = props;

  return (
    <Modal
      confirmButtonText="Yes, empty this bucket"
      isConfirmButtonDisabled={value.toLowerCase() !== "empty bucket"}
      onCancel={onClose}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Empty this bucket"
      width="550px"
    >
      <FormGroup>
        Do you really want to empty this bucket? This will permanently erase all
        data currently in the bucket.
      </FormGroup>

      <FormGroup
        addMarginBottom={false}
        label={`If you want to empty the bucket, type "empty bucket"`}
      >
        <Input
          autoFocus
          onChange={(e) => setValue(e.target.value)}
          placeholder="empty bucket"
          value={value}
        />
      </FormGroup>
    </Modal>
  );
}

export default ModalEmptyDevice;
