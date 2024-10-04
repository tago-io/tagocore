import { IPluginList } from "@tago-io/tcore-sdk/types";
import { observer } from "mobx-react";
import { useCallback, useEffect, useState } from "react";
import { PLUGIN_STORE_PLUGIN_ID, SQLITE_PLUGIN_ID } from "@tago-io/tcore-shared";
import {
  Button,
  EButton,
  EIcon,
  Icon,
  Input,
  Loading,
  PluginImage,
  Publisher,
  Tooltip,
  useApiRequest,
} from "../../..";
import selectPluginFile from "../../../Helpers/selectPluginFile";
import getPluginStoreInstallURLs from "../../../Requests/getPluginStoreInstallURLs";
import store from "../../../System/Store";
import ModalDownloadFromURL from "../../Plugins/Common/ModalDownloadFromURL/ModalDownloadFromURL";
import ModalInstallPlugin from "../../Plugins/Common/ModalInstallPlugin/ModalInstallPlugin";
import ModalMasterPassword from "../../Plugins/Common/ModalMasterPassword/ModalMasterPassword";
import ModalUploadPlugin from "../../Plugins/Common/ModalUploadPlugin/ModalUploadPlugin";
import SetupForm from "../SetupForm/SetupForm";
import * as Style from "./StepDatabaseWithStore.style";

/**
 */
function StepDatabaseWithStore(props: any) {
  const { onBack, onNext } = props;
  const [buttonsDisabled, setButtonsDisabled] = useState(false);
  const [action, setAction] = useState("");
  const [modalInstall, setModalInstall] = useState(false);
  const [modalURL, setModalURL] = useState(false);
  const [modalUpload, setModalUpload] = useState(false);
  const [source, setSource] = useState("");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [uploadedFile, setUploadedFile] = useState<File>();
  const [filter, setFilter] = useState("");
  const [storePluginList, setStorePluginList] = useState<any>([]);
  const { data: installedList } = useApiRequest<IPluginList>("/plugin", {
    skip: !store.masterPassword,
  });
  const { data: platform } = useApiRequest<string>("/hardware/platform");

  const installedListFiltered = installedList?.filter((x) => !x.error) || [];

  const loading = !installedListFiltered; // || !storeList;

  /**
   * Opens the file selector modal.
   */
  const activateModalFile = () => {
    selectPluginFile((f) => {
      setUploadedFile(f);
      setModalUpload(true);
    });
  };

  /**
   * Opens the URL download modal.
   */
  const activateModalURL = () => {
    setModalURL(true);
  };

  /**
   * Closes the URL download modal.
   */
  const deactivateModalURL = () => {
    setModalURL(false);
  };

  /**
   * Closes the file selector modal.
   */
  const deactivateModalFile = () => {
    setModalUpload(false);
  };

  /**
   * Opens the install modal.
   */
  const activateModalInstall = (path: string) => {
    setModalUpload(false);
    setModalURL(false);
    setSource(path);
    setModalInstall(true);
  };

  /**
   * Closes the install modal.
   */
  const deactivateModalInstall = (pluginID: string) => {
    setModalInstall(false);
    if (selectedItem) {
      onNext(selectedItem?.id);
    } else if (pluginID) {
      onNext(pluginID);
    }
  };

  /**
   */
  const confirm = useCallback(async () => {
    const installed = installedListFiltered?.some((x) => x.id === selectedItem?.id && !x.error);
    if (!installed) {
      try {
        setButtonsDisabled(true);
        const urls = await getPluginStoreInstallURLs(selectedItem?.id, selectedItem?.version);
        const item = urls?.find((x) => x.platform === platform || x.platform === "any");
        if (item) {
          activateModalInstall(item.url);
        }
      } finally {
        setButtonsDisabled(false);
      }
    } else {
      onNext(selectedItem?.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [platform, onNext, installedList, selectedItem]);

  /**
   */
  const renderItem = (item: any) => {
    const installed = installedListFiltered?.some((x) => x.id === item.id);
    return (
      <Style.Item key={item.id}>
        <PluginImage src={item.logoURL} width={60} />

        <div className="info">
          <div className="title">
            {item.name}
            {installed && <span className="installed">✓ Installed </span>}
          </div>
          <div className="desc">
            <Publisher clickable domain={item.publisher?.domain} name={item.publisher?.name} />
            <span> • {item.version}</span>
            <span> • {item.description}.</span>
          </div>
        </div>

        <Button
          onClick={() => setSelectedItem(item)}
          disabled={selectedItem?.id === item.id || buttonsDisabled}
          type={EButton.primary}
        >
          {selectedItem?.id === item.id ? "Selected" : "Select Plugin"}
        </Button>
      </Style.Item>
    );
  };

  /**
   */
  const filterPlugins = () => {
    const installedDatabases = installedListFiltered?.filter((x) => x?.types?.includes("database"));
    const result = [];

    for (const plugin of installedDatabases) {
      result.push({
        description: plugin.description,
        id: plugin.id,
        logoURL: `/images/${plugin.id}/icon`,
        name: plugin.name,
        publisher: plugin.publisher,
        version: plugin.version,
      });
    }

    result.sort((a, b) => {
      if (a.id === SQLITE_PLUGIN_ID && b.id !== SQLITE_PLUGIN_ID) {
        // priority for sqlite plugin
        return -1;
      } else if (a.id !== SQLITE_PLUGIN_ID && b.id === SQLITE_PLUGIN_ID) {
        // priority for sqlite plugin
        return 1;
      } else if (a.publisher?.domain === "tago.io" && b.publisher?.domain !== "tago.io") {
        // then, all TagoIO plugins
        return -1;
      } else if (a.publisher?.domain !== "tago.io" && b.publisher?.domain === "tago.io") {
        // then, all TagoIO plugins
        return 1;
      }
      return 0;
    });

    const filtered = result.filter(
      (x) =>
        String(x.name).toLowerCase().includes(filter.toLowerCase()) ||
        String(x.description).toLowerCase().includes(filter.toLowerCase())
    );

    setStorePluginList(filtered);
  };

  /**
   */
  const doAction = () => {
    switch (action) {
      case "local-file":
        activateModalFile();
        break;
      case "download-url":
        activateModalURL();
        break;
      default:
        break;
    }
    setAction("");
  };

  /**
   */
  useEffect(() => {
    if (action && store.masterPassword) {
      doAction();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action, store.masterPassword]);

  /**
   */
  useEffect(() => {
    if (installedList) {
      filterPlugins();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [installedList, filter]);

  return (
    <>
      <SetupForm
        title="Pick a Database Plugin"
        description="A Database plugin is used to store data from your devices"
        buttons={[
          { label: "Back", onClick: onBack },
          {
            label: "Next",
            disabled: !selectedItem || buttonsDisabled,
            onClick: confirm,
            type: EButton.primary,
          },
        ]}
      >
        <Style.Content>
          <div className="input-container">
            <Input
              autoFocus
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Search for a database plugin..."
              value={filter}
              disabled={loading}
            />

            <Tooltip text="Install local plugin">
              <Button onClick={activateModalFile}>
                <Icon size="18px" icon={EIcon["file-arrow-up"]} />
              </Button>
            </Tooltip>

            <Tooltip text="Download from URL">
              <Button onClick={activateModalURL}>
                <Icon size="18px" icon={EIcon["globe-americas"]} />
              </Button>
            </Tooltip>
          </div>

          {loading && <Loading />}

          <div className="plugin-list">{storePluginList.map(renderItem)}</div>
        </Style.Content>
      </SetupForm>

      {modalUpload && (
        <ModalUploadPlugin
          file={uploadedFile as File}
          onClose={deactivateModalFile}
          onUpload={activateModalInstall}
        />
      )}

      {modalURL && (
        <ModalDownloadFromURL onClose={deactivateModalURL} onConfirm={activateModalInstall} />
      )}

      {modalInstall && (
        <ModalInstallPlugin
          onClose={deactivateModalInstall}
          pluginName={uploadedFile?.name}
          source={source}
        />
      )}

      {action && !store.masterPassword && <ModalMasterPassword onClose={() => setAction("")} />}
    </>
  );
}

export default observer(StepDatabaseWithStore);
