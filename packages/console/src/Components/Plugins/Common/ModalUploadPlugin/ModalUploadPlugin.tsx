import axios from "axios";
import { observer } from "mobx-react";
import { memo, useCallback, useEffect, useState } from "react";
import store from "../../../../System/Store.ts";
import Modal from "../../../Modal/Modal.tsx";
import * as Style from "./ModalUploadPlugin.style";

/**
 * Props.
 */
interface IModalUploadPlugin {
  onClose: () => void;
  onUpload: (filepath: string) => void;
  file: File;
}

/**
 * Modal to upload a plugin file.
 */
function ModalUploadPlugin(props: IModalUploadPlugin) {
  const [error, setError] = useState(false);
  const [progress, setProgress] = useState(0);

  const { file, onClose, onUpload } = props;

  /**
   * Uploads the file and returns the source as the call from the API.
   */
  const uploadFile = useCallback(async () => {
    if (!file) {
      return;
    }

    try {
      const form = new FormData();
      form.append("plugin", file);

      const response = await axios({
        url: "/plugin/upload",
        method: "POST",
        data: form,
        headers: { token: store.token, masterPassword: store.masterPassword },
        onUploadProgress: (ev) => {
          const percentage = Math.round((ev.loaded / ev.total) * 100);
          setProgress(percentage);
        },
      });

      onUpload(response.data.result);
      onClose();
    } catch (ex: any) {
      const errorMessage = ex?.response?.data?.message || error?.toString?.();
      setError(errorMessage);
    }
  }, [onClose, onUpload, error, file]);

  /**
   */
  useEffect(() => {
    uploadFile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Modal
      showConfirmButton={false}
      showCancelButton={false}
      showCloseButton={false}
      onCancel={onClose}
      onClose={onClose}
      title="Uploading Plugin file"
      width="550px"
    >
      <Style.Message>Plugin file: {file.name}</Style.Message>

      <Style.Progress done={false} error={false} value={progress}>
        <div className="value">
          <div className="effect" />
        </div>
      </Style.Progress>
    </Modal>
  );
}

export default memo(observer(ModalUploadPlugin));
