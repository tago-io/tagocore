import { useCallback, useMemo, useState } from "react";
import { getSystemName } from "@tago-io/tcore-shared";
import axios from "axios";
import type { ISettings } from "@tago-io/tcore-sdk/types";
import Button from "../../Button/Button.tsx";
import Icon from "../../Icon/Icon.tsx";
import { EIcon } from "../../Icon/Icon.types";
import Tooltip from "../../Tooltip/Tooltip.tsx";
import useApiRequest from "../../../Helpers/useApiRequest.ts";
import store from "../../../System/Store.ts";
import { getLocalStorage } from "../../../Helpers/localStorage.ts";
import ModalFileSelect from "../../ModalFileSelect/ModalFileSelect.tsx";
import * as Style from "./InstalLocalPluginButton.style";
/**
 * This component handles the installation of a plugin.
 */
function InstallLocalPluginButton() {
  const [modalSelectFolder, setModalSelectFolder] = useState(false);
  const { data: settings } = useApiRequest<ISettings>("/mainsettings");
  const token = getLocalStorage("token", "") as string;
  const masterPassword = store.masterPassword;
  const headers = useMemo(() => ({ token, masterPassword }), [token, masterPassword]);

  /**
   * Opens the folder selector modal.
   */
  const activateModalFolder = useCallback(() => {
    setModalSelectFolder(true);
  }, []);

  /**
   * Close the folder selector modal.
   */
  const deactivateModalFolder = useCallback(() => {
    setModalSelectFolder(false);
  }, []);

  /**
   * Add plugin folder to the property custom_plugins.
   */
  const addFolder = useCallback(
    (folder) => {
      axios.post("/plugin/addexternalplugin", { folder }, { headers });
    },
    [headers]
  );

  return (
    <>
      <Style.Container>
        <Tooltip text="Install local plugin">
          <Button onClick={activateModalFolder}>
            <Icon icon={EIcon["puzzle-piece"]} size="15px" />
          </Button>
        </Tooltip>
      </Style.Container>

      {modalSelectFolder && (
        <ModalFileSelect
          accept={""}
          onlyFolders={true}
          defaultFilePath={settings?.settings_folder}
          message={`Select a folder of your plugin of ${getSystemName()}.`}
          onClose={deactivateModalFolder}
          onConfirm={addFolder}
          useLocalFs={true}
          title="Select a folder"
        />
      )}
    </>
  );
}

export default InstallLocalPluginButton;
