import type { ISettings } from "@tago-io/tcore-sdk/types";
import { getSystemName } from "@tago-io/tcore-shared";
import axios from "axios";
import { useCallback, useMemo, useState } from "react";
import { getLocalStorage } from "../../../Helpers/localStorage.ts";
import useApiRequest from "../../../Helpers/useApiRequest.ts";
import store from "../../../System/Store.ts";
import Button from "../../Button/Button.tsx";
import Icon from "../../Icon/Icon.tsx";
import { EIcon } from "../../Icon/Icon.types";
import ModalFileSelect from "../../ModalFileSelect/ModalFileSelect.tsx";
import Tooltip from "../../Tooltip/Tooltip.tsx";
import * as Style from "./InstalLocalPluginButton.style";

function InstallLocalPluginButton() {
  const [modalSelectFolder, setModalSelectFolder] = useState(false);
  const { data: settings } = useApiRequest<ISettings>("/mainsettings");
  const token = getLocalStorage("token", "") as string;
  const masterPassword = store.masterPassword;
  const headers = useMemo(
    () => ({ token, masterPassword }),
    [token, masterPassword],
  );

  const activateModalFolder = useCallback(() => {
    setModalSelectFolder(true);
  }, []);

  const deactivateModalFolder = useCallback(() => {
    setModalSelectFolder(false);
  }, []);

  const addFolder = useCallback(
    (path: string) => {
      axios.post("/plugin/addexternalplugin", { folder: path }, { headers });
    },
    [headers],
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
