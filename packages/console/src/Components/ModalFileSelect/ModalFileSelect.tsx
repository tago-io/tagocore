import React, {
  memo,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useTheme } from "styled-components";
import useApiRequest from "../../Helpers/useApiRequest.ts";
import { EmptyMessage } from "../../index.ts";
import FormGroup from "../FormGroup/FormGroup.tsx";
import Icon from "../Icon/Icon.tsx";
import { EIcon } from "../Icon/Icon.types";
import Input from "../Input/Input.tsx";
import Loading from "../Loading/Loading.tsx";
import Modal from "../Modal/Modal.tsx";
import * as Style from "./ModalFileSelect.style";
import type { IFile } from "./ModalFileSelect.types";

/**
 * Props.
 */
interface IModalFileSelect {
  /**
   * File extension to be accepted.
   * For example, if you only want `javascript` files to be selected, then this prop would have to be = ".js".
   */
  accept: string;
  /**
   * Called when the modal is closed.
   */
  onClose: () => void;
  /**
   * Called when a file is selected.
   */
  onConfirm: (filePath: string) => void;
  /**
   * Optional message to be rendered at the top of the component.
   */
  message?: ReactNode;
  /**
   * Default file path to be used in the input.
   */
  defaultFilePath?: string;
  /**
   * If only folders can be selected.
   */
  onlyFolders?: boolean;
  /**
   * The title of the modal. This parameter is optional.
   */
  title?: string;
  /**
   * Optional placeholder for the input.
   */
  placeholder?: string;
  /**
   * Use local filesystem for the list.
   */
  useLocalFs?: boolean;
}

/**
 * This modal shows the computer file tree.
 * The file tree shown here is from the server, not from the client executing this code.
 */
function ModalFileSelect(props: IModalFileSelect) {
  const [value, setValue] = useState(props.defaultFilePath || "");
  const [path, setPath] = useState(() => props.defaultFilePath || "");
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState<IFile[]>([]);
  const [selected, setSelected] = useState("");
  const [isSelectedFolder, setIsSelectedFolder] = useState(false);
  const { data, error } = useApiRequest<IFile[]>(
    `/file?local_fs=${props.useLocalFs ? "true" : ""}&path=${path}`,
  );
  const theme = useTheme();
  const focused = useRef(false);
  const refFilesContainer = useRef<HTMLDivElement>(null);

  const { accept, title, placeholder, onClose, onConfirm } = props;

  // used to enable/disable the confirm button:
  let confirmDisabled = (accept && !selected.endsWith(accept)) as boolean;
  if (props.onlyFolders) {
    confirmDisabled = !isSelectedFolder;
  }

  /**
   * Called when the main modal button is pressed.
   * This is used to send the selected file path to the other side.
   */
  const confirm = useCallback(() => {
    onConfirm(value);
  }, [onConfirm, value]);

  /**
   * Renders the message at the top of the component. This is a great way
   * to show some additional information for the user.
   */
  const renderMessage = () => {
    if (!props.message) {
      return null;
    }
    return <Style.Message>{props.message}</Style.Message>;
  };

  /**
   * Called when a file is clicked.
   * This will toggle the selection for the file: if it's already selected it will be unselected
   * and if it's unselected it will be selected.
   */
  const onClickFile = (file: IFile) => {
    if (file.is_folder) {
      setPath(file.path);
      setSelected(file.path);
      setValue(file.path);
      setIsSelectedFolder(file.is_folder);
      if (path !== file.path) {
        setLoading(true);
      }
    } else {
      setSelected(file.path);
      setValue(file.path);
      setIsSelectedFolder(file.is_folder);
    }
  };

  /**
   * Renders the input part.
   */
  const renderInput = () => {
    return (
      <Style.InputContainer>
        <FormGroup icon={EIcon.folder} label="File path">
          <Input
            disabled={files.length === 0}
            onBlur={() => (focused.current = false)}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => (focused.current = true)}
            placeholder={
              placeholder || "enter a path or select one in the list"
            }
            value={value}
          />
        </FormGroup>
      </Style.InputContainer>
    );
  };

  /**
   * Renders the empty warning for a folder.
   * This indicates that the folder has no contents inside of it.
   */
  const renderEmptyWarning = () => {
    return <div className="empty-warning">Nothing in this folder.</div>;
  };

  /**
   * Renders a single file/folder.
   * The indentation indicates how much padding-left the component should have.
   */
  const renderSingleFile = (file: IFile, indentation: number) => {
    const isSelected = selected === file.path;

    let icon = EIcon.spinner;
    if (loading && isSelected) {
      icon = EIcon.spinner;
    } else if (file.is_folder) {
      icon = EIcon.folder;
    } else {
      icon = EIcon["file-alt"];
    }

    const iconColor = file.is_folder ? theme.files : "";

    const matchesExtension = !accept || file.name.endsWith(accept);

    let enabled = file.is_folder || matchesExtension;
    if (props.onlyFolders && !file.is_folder) {
      enabled = false;
    }

    const showEmptyWarning =
      (!file.children || file.children.length === 0) &&
      file.is_folder &&
      isSelected &&
      !loading;

    return (
      <React.Fragment key={file.path}>
        <Style.SingleFile
          disabled={!enabled}
          indentation={indentation}
          onClick={() => enabled && onClickFile(file)}
          selected={isSelected}
          ref={(e) => ((file as any).ref = e)}
        >
          <Icon rotate={icon === EIcon.spinner} color={iconColor} icon={icon} />
          <span>{file.name}</span>
        </Style.SingleFile>

        {showEmptyWarning
          ? renderEmptyWarning()
          : file.children?.map((f) => renderSingleFile(f, indentation + 1))}
      </React.Fragment>
    );
  };

  /**
   */
  const renderFiles = () => {
    const errorMessage = error?.response?.data?.message || error?.toString?.();
    return (
      <Style.Files ref={refFilesContainer}>
        {error ? (
          <EmptyMessage
            icon={EIcon["exclamation-triangle"]}
            message={errorMessage}
          />
        ) : loading && files.length === 0 ? (
          <Loading />
        ) : !loading && files.length === 0 ? (
          <EmptyMessage
            icon={EIcon["file-alt"]}
            message="Something went wrong"
          />
        ) : (
          files.map((file) => renderSingleFile(file, 0))
        )}
      </Style.Files>
    );
  };

  /**
   * Used to transfer the data from the API request to the state.
   * We have to transfer to the local state in order to avoid `null` values
   * in-between requests.
   */
  useEffect(() => {
    if (data) {
      setFiles([...data]);
      setLoading(false);
    }
  }, [data]);

  /**
   * Effect responsible for verifying if the string typed in the input really exists or not.
   * If the path does not exist, the selected path will be set to an empty string.
   * if the path does exist, the selected path will be set to the current input value.
   * This should be called every time the input changes its value and it's not focused.
   */
  useEffect(() => {
    if (files.length <= 0) {
      return;
    }

    let increments = 0;
    let max: IFile | undefined;

    for (const i of files) {
      let item: IFile = i;
      let newItem: IFile | undefined = undefined;
      let localIncrements = 0;

      // eslint-disable-next-line no-constant-condition
      while (true) {
        localIncrements++;
        newItem = (item.children || []).find((x) => x?.children.length > 0);
        if (!newItem) {
          break;
        }
        item = newItem;
      }

      if (localIncrements > increments) {
        max = item;
        increments = localIncrements;
      }
    }

    if (refFilesContainer.current && max && increments > 1) {
      const split = String(value).split("/");
      const last = split[split.length - 1];
      const item = max.children.find((x) => x.name === last);
      if (item) {
        setSelected(item.path);
        refFilesContainer.current.scrollTop = (item as any)?.ref.offsetTop;
      } else {
        setSelected(max.path);
        refFilesContainer.current.scrollTop = (max as any)?.ref.offsetTop;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files.length]);

  /**
   */
  useEffect(() => {
    if (files.length > 0) {
      setPath(value);
    }
  }, [files.length, value]);

  return (
    <Modal
      color={theme.files}
      icon={EIcon["file-import"]}
      isConfirmButtonDisabled={confirmDisabled}
      onClose={onClose}
      onConfirm={confirm}
      title={title || "Select a file"}
      width="600px"
      height="90%"
    >
      <Style.Container>
        {renderMessage()}
        {renderInput()}
        {renderFiles()}
      </Style.Container>
    </Modal>
  );
}

export default memo(ModalFileSelect);
