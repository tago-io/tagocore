import { EButton } from "../../../Button/Button.types";
import Modal from "../../../Modal/Modal.tsx";

/**
 * Props.
 */
interface IModalChangesProps {
  /**
   * Called when the modal is closed.
   */
  onClose: () => void;
  /**
   * Called when the modal is canceled.
   */
  onCancel: () => Promise<any>;
  /**
   * Called when the modal is confirmed.
   */
  onConfirm: () => Promise<any>;
}

/**
 */
function ModalChanges(props: IModalChangesProps) {
  const { onConfirm, onCancel, onClose } = props;
  return (
    <Modal
      confirmButtonText="Ok"
      confirmButtonType={EButton.primary}
      cancelButtonText="Restart later"
      showCancelButton={false}
      onClose={onClose}
      onCancel={onCancel}
      onConfirm={onConfirm}
      title="Confirm changes"
    >
      Some changes that were made will only take effect when the application restarts.
    </Modal>
  );
}

export default ModalChanges;
