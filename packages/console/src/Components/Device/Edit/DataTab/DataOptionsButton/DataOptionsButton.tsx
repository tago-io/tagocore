import type { IDevice } from "@tago-io/tcore-sdk/types";
import { useCallback, useEffect, useState } from "react";

import { EButton } from "../../../../../Components/Button/Button.types.ts";
import Modal from "../../../../../Components/Modal/Modal.tsx";
import ModalFileSelect from "../../../../../Components/ModalFileSelect/ModalFileSelect.tsx";
import { backupDeviceData } from "../../../../../Requests/backupDeviceData.ts";
import { emptyDeviceData } from "../../../../../Requests/emptyDeviceData.ts";
import { restoreDeviceData } from "../../../../../Requests/restoreDeviceData.ts";
import Button from "../../../../Button/Button.tsx";
import Icon from "../../../../Icon/Icon.tsx";
import { EIcon } from "../../../../Icon/Icon.types";
import * as Style from "./DataOptionsButton.style";

interface DataOptionsButtonProps {
  device: IDevice;
  disabled?: boolean;
  onRefreshData: () => void;
}

export function DataOptionsButton(props: DataOptionsButtonProps) {
  const { disabled } = props;

  const [dropdown, setDropdown] = useState(false);
  const [defaultBackupPath, setDefaultBackupPath] = useState<string>(() => {
    try {
      return localStorage.getItem("tcore::backup-path") || "";
    } catch {
      return "";
    }
  });
  const [modalConfirmEmpty, setModalConfirmEmpty] = useState(false);
  const [modalBackupData, setModalBackupData] =
    useState<TBackupDataState>(null);
  const [modalRestoreData, setModalRestoreData] =
    useState<TRestoreDataState>(null);

  const onClickOptions = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      setDropdown(true);
    },
    [],
  );

  const confirmEmptyData = useCallback(async () => {
    await emptyDeviceData(props.device.id);
    props.onRefreshData();
    setModalConfirmEmpty(false);
  }, [props.onRefreshData, props.device.id]);

  const persistBackupPath = useCallback((path: string) => {
    try {
      setDefaultBackupPath(path);
      localStorage.setItem("tcore::backup-path", path);
    } catch {}
  }, []);

  const backupData = useCallback(
    async (targetDirectory: string) => {
      setModalBackupData({ state: "in-progress", targetDirectory });

      try {
        const response = await backupDeviceData(props.device.id, {
          targetDirectory,
        });
        if (response.status) {
          persistBackupPath(targetDirectory);
          setModalBackupData({
            state: "complete",
            filePath: response.result,
          });
        } else {
          setModalBackupData({ state: "error" });
        }
      } catch (error) {
        setModalBackupData({ state: "error" });
      }
    },
    [props.device.id, persistBackupPath],
  );

  const restoreData = useCallback(
    async (filePath: string) => {
      setModalRestoreData({ state: "in-progress", filePath });

      try {
        const response = await restoreDeviceData(props.device.id, {
          filePath,
        });
        if (response.status) {
          setModalRestoreData({
            state: "complete",
            filePath,
          });
          props.onRefreshData();
        } else {
          setModalRestoreData({ state: "error" });
        }
      } catch (error) {
        setModalRestoreData({ state: "error" });
      }
    },
    [props.device.id, props.onRefreshData],
  );

  useEffect(() => {
    function closeDropdown() {
      setDropdown(false);
    }

    window.addEventListener("mousedown", closeDropdown);
    return () => window.removeEventListener("mousedown", closeDropdown);
  });

  return (
    <>
      <Button disabled={disabled} addIconMargin onClick={onClickOptions}>
        <Icon icon={EIcon["ellipsis-v"]} />
        <span>More</span>
      </Button>

      <Style.Dropdown
        visible={dropdown}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div
          className="item"
          onClick={() => setModalRestoreData({ state: "select-file" })}
        >
          <span>Restore from file</span>
        </div>
        <div
          className="item"
          onClick={() => setModalBackupData({ state: "select-folder" })}
        >
          <span>Backup to file</span>
        </div>
        <div className="item" onClick={() => setModalConfirmEmpty(true)}>
          <span>Empty Device data</span>
        </div>
      </Style.Dropdown>

      {modalConfirmEmpty && (
        <Modal
          confirmButtonText="Yes, empty data"
          confirmButtonType={EButton.danger}
          onClose={() => setModalConfirmEmpty(false)}
          onConfirm={confirmEmptyData}
          title="Empty Device data"
        >
          Confirming will empty all data from the <b>{props.device.name}</b>{" "}
          Device permanently.
        </Modal>
      )}

      {modalBackupData?.state === "select-folder" && (
        <ModalFileSelect
          accept={""}
          defaultFilePath={defaultBackupPath}
          title="Select a folder"
          message="Select the target folder to backup the data."
          onlyFolders
          useLocalFs
          onClose={() => setModalBackupData(null)}
          onConfirm={backupData}
        />
      )}

      {!!modalBackupData?.state &&
        modalBackupData.state !== "select-folder" && (
          <Modal
            title="Backup data"
            confirmButtonText="Close"
            width="800px"
            confirmButtonType={EButton.primary}
            showCancelButton={false}
            showCloseButton={false}
            isConfirmButtonDisabled={modalBackupData.state === "in-progress"}
            onConfirm={() => setModalBackupData(null)}
            onClose={() => setModalBackupData(null)}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.2rem",
                maxWidth: "750px",
              }}
            >
              {modalBackupData.state === "in-progress" && (
                <>
                  <span style={{ display: "block" }}>Backing up data to:</span>
                  <pre style={{ display: "block" }}>
                    {modalBackupData.targetDirectory}
                  </pre>
                </>
              )}

              {modalBackupData.state === "complete" && (
                <>
                  <span style={{ display: "block" }}>
                    Data backup created at:
                  </span>
                  <pre style={{ display: "block" }}>
                    {modalBackupData.filePath}
                  </pre>
                </>
              )}

              {modalBackupData.state === "error" && (
                <span>There was an error while backing up the data.</span>
              )}
            </div>
          </Modal>
        )}

      {modalRestoreData?.state === "select-file" && (
        <ModalFileSelect
          accept={".csv"}
          defaultFilePath={defaultBackupPath}
          title="Select a file"
          message="Select the CSV file to restore data to this device."
          useLocalFs
          onClose={() => setModalRestoreData(null)}
          onConfirm={restoreData}
        />
      )}

      {!!modalRestoreData?.state &&
        modalRestoreData.state !== "select-file" && (
          <Modal
            title="Restore data"
            confirmButtonText="Close"
            width="800px"
            confirmButtonType={EButton.primary}
            showCancelButton={false}
            showCloseButton={false}
            isConfirmButtonDisabled={modalRestoreData.state === "in-progress"}
            onConfirm={() => setModalRestoreData(null)}
            onClose={() => setModalRestoreData(null)}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.2rem",
                maxWidth: "750px",
              }}
            >
              {modalRestoreData.state === "in-progress" && (
                <>
                  <span style={{ display: "block" }}>Restoring data from:</span>
                  <pre style={{ display: "block" }}>
                    {modalRestoreData.filePath}
                  </pre>
                </>
              )}

              {modalRestoreData.state === "complete" && (
                <>
                  <span style={{ display: "block" }}>
                    Data successfully restored from:
                  </span>
                  <pre style={{ display: "block" }}>
                    {modalRestoreData.filePath}
                  </pre>
                </>
              )}

              {modalRestoreData.state === "error" && (
                <span>There was an error while restoring the data.</span>
              )}
            </div>
          </Modal>
        )}
    </>
  );
}

type TBackupDataState =
  | { state: "select-folder" }
  | { state: "in-progress"; targetDirectory: string }
  | { state: "complete"; filePath: string }
  | { state: "error" }
  | null;

type TRestoreDataState =
  | { state: "select-file" }
  | { state: "in-progress"; filePath: string }
  | { state: "complete"; filePath: string }
  | { state: "error" }
  | null;
