import { getSystemName } from "@tago-io/tcore-shared";
import {
  type KeyboardEvent,
  type MouseEvent,
  useCallback,
  useState,
} from "react";
import Checkbox from "../../../Checkbox/Checkbox.tsx";
import FormGroup from "../../../FormGroup/FormGroup.tsx";
import Input from "../../../Input/Input.tsx";
import Modal from "../../../Modal/Modal.tsx";
import TooltipText from "../../../TooltipText/TooltipText.tsx";

/**
 * Props.
 */
interface IModalUninstallPluginProps {
  /**
   * Called when the user cancels the uninstall.
   */
  onClose: () => void;
  /**
   * Called when the user confirms the uninstall.
   */
  onConfirm: (keepData: boolean) => Promise<void>;
  /**
   * This prop indicates where to send the user to once the process end.
   */
  redirectTo?: string;
}

/**
 */
function ModalUninstallPlugin(props: IModalUninstallPluginProps) {
  const [value, setValue] = useState("");
  const [keepData, setKeepData] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const { onConfirm, onClose, redirectTo } = props;

  /**
   * Confirms the uninstall for the plugin.
   */
  const confirm = useCallback(
    async (e?: MouseEvent) => {
      setButtonDisabled(true);
      await onConfirm(keepData);
      e?.preventDefault();

      if (redirectTo) {
        window.location.href = `/console${redirectTo}`;
      } else {
        window.location.reload();
      }
    },
    [keepData, onConfirm, redirectTo],
  );

  /**
   * Called when the input receives a keydown event.
   */
  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        if (value === "uninstall") {
          confirm();
        }
      }
    },
    [confirm, value],
  );

  return (
    <Modal
      confirmButtonText="Yes, uninstall this plugin"
      isConfirmButtonDisabled={
        buttonDisabled || value.toLowerCase() !== "uninstall"
      }
      isCancelButtonDisabled={buttonDisabled}
      onCancel={onClose}
      onClose={onClose}
      onConfirm={confirm}
      title="Uninstall plugin"
      width="550px"
    >
      <FormGroup>Do you really want to uninstall this plugin?</FormGroup>

      <FormGroup
        label={`If you want to uninstall the plugin, type "uninstall"`}
      >
        <Input
          autoFocus
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="uninstall"
          disabled={buttonDisabled}
          value={value}
        />
      </FormGroup>

      <FormGroup addMarginBottom={false}>
        <Checkbox
          checked={keepData}
          onChange={(e) => setKeepData(e.target.checked)}
        >
          <TooltipText
            tooltip={`Checking this option prevents ${getSystemName()} from erasing settings related to this plugin`}
          >
            Keep settings
          </TooltipText>
        </Checkbox>
      </FormGroup>
    </Modal>
  );
}

export default ModalUninstallPlugin;
