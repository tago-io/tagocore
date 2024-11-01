import { useCallback, useState } from "react";
import Button from "../Button/Button.tsx";
import { EButton } from "../Button/Button.types";
import ErrorMessage from "../ErrorMessage/ErrorMessage.tsx";
import Icon from "../Icon/Icon.tsx";
import { EIcon } from "../Icon/Icon.types";
import Input from "../Input/Input.tsx";
import ModalFileSelect from "../ModalFileSelect/ModalFileSelect.tsx";
import * as Style from "./FileSelect.style";

/**
 * Props.
 */
interface IFileSelectProps {
  /**
   * The selected file path.
   */
  value: string;
  /**
   * Called when the selected file path changes.
   */
  onChange: (value: string) => void;
  /**
   * Message that will appear inside of the file selector modal.
   */
  modalMessage?: string;
  /**
   * Placeholder for the input.
   */
  placeholder?: string;
  /**
   * Extensions to accept.
   */
  accept?: string;
  /**
   * If the select can only select folders.
   */
  onlyFolders?: boolean;
  /**
   * Indicates if the input has an error.
   */
  error?: boolean;
  /**
   * If the input is disabled or not.
   */
  disabled?: boolean;
  /**
   * Use local filesystem for the list.
   */
  useLocalFs?: boolean;
}

/**
 * Input and a button that reads "Select a file".
 * When the button is clicked, the `ModalFileSelect` will appear.
 */
function FileSelect(props: IFileSelectProps) {
  const [modalFile, setModalFile] = useState(false);
  const {
    value,
    error,
    disabled,
    accept,
    modalMessage,
    onlyFolders,
    onChange,
  } = props;
  const placeholder =
    props.placeholder || `Select a ${onlyFolders ? "folder" : "file"}`;

  /**
   * Opens the file selector modal.
   */
  const activateModalFile = useCallback(() => {
    setModalFile(true);
  }, []);

  /**
   * Closes the file selector modal.
   */
  const deactivateModalFile = useCallback(() => {
    setModalFile(false);
  }, []);

  /**
   * Renders the input icon on the right side of the component.
   */
  const renderInputIcon = () => {
    if (!value) {
      // nothing to clear
      return null;
    }

    return (
      <Style.IconContainer onClick={() => onChange("")}>
        <Icon size="13px" icon={EIcon.times} />
      </Style.IconContainer>
    );
  };

  return (
    <>
      <Style.Container>
        <div className="input-container">
          <Input
            error={error}
            placeholder={placeholder}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
          />
          {!disabled && renderInputIcon()}
        </div>

        <Button
          disabled={disabled}
          onClick={activateModalFile}
          type={EButton.primary}
        >
          Select {onlyFolders ? "folder" : "file"}
        </Button>

        {modalFile && (
          <ModalFileSelect
            accept={accept || ""}
            onlyFolders={onlyFolders}
            defaultFilePath={value}
            message={modalMessage}
            onClose={deactivateModalFile}
            onConfirm={onChange}
            useLocalFs={props.useLocalFs}
          />
        )}
      </Style.Container>

      {error && <ErrorMessage>This field is required</ErrorMessage>}
    </>
  );
}

export default FileSelect;
