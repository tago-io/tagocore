import {
  type MouseEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";
import { createPortal } from "react-dom";
import Button from "../Button/Button.tsx";
import { EButton } from "../Button/Button.types";
import Footer from "../Footer/Footer.tsx";
import Icon from "../Icon/Icon.tsx";
import { EIcon } from "../Icon/Icon.types";
import * as Style from "./Modal.style";

/**
 * Props.
 */
interface IModalProps {
  /**
   * Called when the modal is closed by the user.
   */
  onClose?: () => void;
  /**
   */
  onCancel?: () => Promise<void> | void;
  /**
   */
  onConfirm?: (e: MouseEvent) => Promise<void> | void;
  /**
   * Content of the modal.
   */
  children?: ReactNode;
  /**
   * Main title of the modal, appears in the header.
   */
  title?: string;
  /**
   */
  confirmButtonType?: EButton;
  /**
   */
  confirmButtonText?: ReactNode;
  /**
   */
  isConfirmButtonDisabled?: boolean;
  /**
   */
  width?: string;
  /**
   */
  height?: string;
  /**
   */
  cancelButtonText?: ReactNode;
  /**
   */
  color?: string;
  /**
   */
  icon?: EIcon;
  /**
   */
  showCloseButton?: boolean;
  /**
   */
  showCancelButton?: boolean;
  /**
   */
  showConfirmButton?: boolean;
  /**
   */
  showHeader?: boolean;
  /**
   */
  isCancelButtonDisabled?: boolean;
}

/**
 */
function Modal(props: IModalProps) {
  const [buttonsDisabled, setButtonsDisabled] = useState(false);
  const [shouldClose, setShouldClose] = useState(false);
  const {
    cancelButtonText,
    color,
    confirmButtonText,
    confirmButtonType,
    height,
    icon,
    isConfirmButtonDisabled,
    isCancelButtonDisabled,
    onCancel,
    onClose,
    onConfirm,
    showCancelButton,
    showCloseButton,
    showConfirmButton,
    showHeader,
    title,
    width,
  } = props;

  /**
   */
  const confirm = useCallback(
    async (e: MouseEvent<HTMLButtonElement>) => {
      setButtonsDisabled(true);
      try {
        await onConfirm?.(e);
        if (!e.defaultPrevented) {
          setShouldClose(true);
        }
      } finally {
        if (e.defaultPrevented) {
          setButtonsDisabled(false);
        }
      }
    },
    [onConfirm],
  );

  /**
   */
  const cancel = useCallback(async () => {
    if (!onCancel) {
      onClose?.();
      return;
    }

    setButtonsDisabled(true);
    try {
      await onCancel();
      setShouldClose(true);
    } finally {
      setButtonsDisabled(false);
    }
  }, [onCancel, onClose]);

  /**
   * Renders the header.
   */
  const renderHeader = () => {
    if (showHeader === false) {
      return null;
    }

    return (
      <Style.Header backgroundColor={color}>
        <div>
          {icon && (
            <Style.Icon backgroundColor={color}>
              <Icon size="20px" color={color} icon={icon} />
            </Style.Icon>
          )}

          <h1>{title}</h1>
        </div>

        {showCloseButton !== false && (
          <Button
            disabled={buttonsDisabled || isCancelButtonDisabled}
            onClick={onClose}
            type={EButton.icon}
            color={color}
          >
            <Icon size="15px" icon={EIcon.times} />
          </Button>
        )}
      </Style.Header>
    );
  };

  /**
   * Renders the content.
   */
  const renderContent = () => {
    return <div className="content">{props.children}</div>;
  };

  /**
   * Renders the footer.
   */
  const renderFooter = () => {
    const shouldRender =
      showCancelButton !== false || showConfirmButton !== false;
    if (!shouldRender) {
      return null;
    }

    return (
      <Footer>
        <div>
          {showCancelButton !== false && (
            <Button
              disabled={buttonsDisabled || isCancelButtonDisabled}
              onClick={cancel}
            >
              {cancelButtonText || "Cancel"}
            </Button>
          )}
        </div>

        <div>
          {showConfirmButton !== false && (
            <Button
              disabled={buttonsDisabled || isConfirmButtonDisabled}
              onClick={confirm}
              color={color}
              type={confirmButtonType || EButton.primary}
            >
              {confirmButtonText || "Confirm"}
            </Button>
          )}
        </div>
      </Footer>
    );
  };

  useEffect(() => {
    if (shouldClose) {
      onClose?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldClose]);

  return createPortal(
    <Style.Container>
      <Style.Card width={width} height={height}>
        {renderHeader()}
        {renderContent()}
        {renderFooter()}
      </Style.Card>
    </Style.Container>,
    document.body,
  );
}

export default Modal;
