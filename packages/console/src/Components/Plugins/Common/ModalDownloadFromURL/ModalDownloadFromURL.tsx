import {
  type KeyboardEvent,
  type MouseEvent,
  useCallback,
  useState,
} from "react";
import { z } from "zod";
import { EIcon } from "../../../../index.ts";
import FormGroup from "../../../FormGroup/FormGroup.tsx";
import Input from "../../../Input/Input.tsx";
import Modal from "../../../Modal/Modal.tsx";

/**
 * Props.
 */
interface IModalMasterPasswordProps {
  onClose: () => void;
  onConfirm: (url: string) => void;
}

/**
 */
function ModalDownloadFromURL(props: IModalMasterPasswordProps) {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  const { onConfirm, onClose } = props;

  const valid = z
    .string()
    .url()
    .safeParse(value || "").success;

  /**
   */
  const confirm = useCallback(
    async (e?: MouseEvent) => {
      e?.preventDefault();

      setError(!valid);

      if (valid) {
        onConfirm(value);
      }
    },
    [value, onConfirm, valid],
  );

  /**
   * Called when the input receives a keydown event.
   */
  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        confirm();
      }
    },
    [confirm],
  );

  return (
    <Modal
      confirmButtonText="Continue"
      isConfirmButtonDisabled={!valid}
      onCancel={onClose}
      onClose={onClose}
      onConfirm={confirm}
      title="Download Plugin from URL"
      width="550px"
    >
      <FormGroup>Please enter a link to a .tcore Plugin file.</FormGroup>

      <FormGroup addMarginBottom={false} label="Plugin URL" icon={EIcon.link}>
        <Input
          autoFocus
          error={error}
          errorMessage="Invalid URL"
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Enter an URL to a .tcore file"
          value={value}
        />
      </FormGroup>
    </Modal>
  );
}

export default ModalDownloadFromURL;
