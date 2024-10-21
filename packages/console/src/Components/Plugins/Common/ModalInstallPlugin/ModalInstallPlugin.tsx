import type { ILog } from "@tago-io/tcore-sdk/types";
import { observer } from "mobx-react";
import { memo, useCallback, useEffect, useState } from "react";
import { unstable_batchedUpdates } from "react-dom";
import { useTheme } from "styled-components";
import installPlugin from "../../../../Requests/installPlugin.ts";
import { getSocket } from "../../../../System/Socket.ts";
import store from "../../../../System/Store.ts";
import Console from "../../../Console/Console.tsx";
import { EIcon } from "../../../Icon/Icon.types";
import Modal from "../../../Modal/Modal.tsx";
import * as Style from "./ModalInstallPlugin.style";

/**
 * Props.
 */
interface IModalInstallPlugin {
  /**
   * Called when the modal is closed.
   */
  onClose: (pluginID: string) => void;
  /**
   * The file path for the plugin that will be installed.
   */
  source: string;
  /**
   * Name of the plugin or the file that is being installed. Purely visual.
   */
  pluginName?: string;
}

/**
 * Controls the whole logic of making the request to install a plugin.
 * It also shows a progress bar and some output for the user to see how long the process may take.
 * This modal only install plugins in the filesystem, not files that can be downloaded.
 */
function ModalInstallPlugin(props: IModalInstallPlugin) {
  const [logs, setLogs] = useState<ILog[]>([]);
  const [done, setDone] = useState(false);
  const [error, setError] = useState(false);
  const [pluginData, setPluginData] = useState<any>(null);
  const [progress, setProgress] = useState(0);
  const theme = useTheme();
  const { source, pluginName, onClose } = props;

  /**
   * Sends the install request to the back-end.
   */
  const sendInstallRequest = useCallback(async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    try {
      const data = await installPlugin(source);
      setPluginData(data);
      setProgress(100); // just to make sure it shows the bar complete
    } catch (e) {
      setError(true);
    } finally {
      setTimeout(() => {
        setDone(true);
      }, 500);
    }
  }, [source]);

  /**
   * Makes the request to install the plugin.
   */
  useEffect(() => {
    if (done) {
      return;
    }

    function onInstallLogs(data: any) {
      const log: ILog = {
        message: data.message,
        error: data.error,
        timestamp: Date.now() as any,
      };

      unstable_batchedUpdates(() => {
        if (data.error) {
          setError(true);
        }
        setProgress(data.progress);
        setLogs((l) => [...l, log]);
      });
    }

    getSocket().on("plugin::install", onInstallLogs);
    return () => {
      getSocket().off("plugin::install", onInstallLogs);
    };
  }, [done]);

  /**
   * Attaches and detaches the plugin to get the logs during installation.
   */
  useEffect(() => {
    if (store.socketConnected) {
      getSocket().emit("attach", "install");
      return () => {
        getSocket().emit("unattach", "install");
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.socketConnected]);

  /**
   * Makes the request to install the plugin.
   */
  useEffect(() => {
    sendInstallRequest();
  }, [sendInstallRequest]);

  return (
    <Modal
      color={theme.buttonPrimary}
      icon={EIcon["puzzle-piece"]}
      onClose={() => onClose(pluginData)}
      confirmButtonText="Close"
      title="Installing Plugin"
      width="850px"
      height="90%"
      showCancelButton={false}
      showCloseButton={false}
      isConfirmButtonDisabled={!done}
    >
      <Style.Container>
        {pluginName && <Style.Message>Installing Plugin: {pluginName}</Style.Message>}

        <Style.Progress done={done} error={error} value={progress}>
          <div className="value">
            <div className="effect" />
          </div>
        </Style.Progress>

        <div className="console-container">
          <Console data={logs} />
        </div>
      </Style.Container>
    </Modal>
  );
}

export default memo(observer(ModalInstallPlugin));
