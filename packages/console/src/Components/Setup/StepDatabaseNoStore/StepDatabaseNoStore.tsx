import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import selectPluginFile from "../../../Helpers/selectPluginFile.ts";
import store from "../../../System/Store.ts";
import { Button, EButton, EIcon, Icon } from "../../../index.ts";
import ModalDownloadFromURL from "../../Plugins/Common/ModalDownloadFromURL/ModalDownloadFromURL.tsx";
import ModalInstallPlugin from "../../Plugins/Common/ModalInstallPlugin/ModalInstallPlugin.tsx";
import ModalMasterPassword from "../../Plugins/Common/ModalMasterPassword/ModalMasterPassword.tsx";
import ModalUploadPlugin from "../../Plugins/Common/ModalUploadPlugin/ModalUploadPlugin.tsx";
import SetupForm from "../SetupForm/SetupForm.tsx";
import * as Style from "./StepDatabaseNoStore.style";

/**
 * Database step without the Plugin store. It contains two buttons:
 * - load local plugin
 * - load from url
 */
function StepDatabaseNoStore(props: any) {
  const { onBack, onNext } = props;
  const [action, setAction] = useState("");
  const [modalInstall, setModalInstall] = useState(false);
  const [modalURL, setModalURL] = useState(false);
  const [modalUpload, setModalUpload] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File>();
  const [source, setSource] = useState("");

  /**
   * Opens the file selector modal.
   */
  const activateModalUpload = () => {
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
  const deactivateModalUpload = () => {
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
    if (pluginID) {
      onNext(pluginID);
    }
  };

  /**
   */
  const doAction = () => {
    switch (action) {
      case "local-file":
        activateModalUpload();
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

  return (
    <>
      <SetupForm
        title="Pick a Database Plugin"
        description="A Database plugin is used to store data from your devices"
        buttons={[{ label: "Back", onClick: onBack }]}
      >
        <Style.Content>
          <Icon icon={EIcon.database} size="50px" color="rgba(0, 0, 0, 0.2)" />

          <span className="to-continue">
            To continue, you must load a .tcore file
          </span>

          <div className="decision">
            <Button
              onClick={() => setAction("local-file")}
              type={EButton.primary}
            >
              Select local file
            </Button>
            <span>or</span>
            <Button
              onClick={() => setAction("download-url")}
              type={EButton.primary}
            >
              Download from URL
            </Button>
          </div>
        </Style.Content>
      </SetupForm>

      {modalUpload && (
        <ModalUploadPlugin
          file={uploadedFile as File}
          onClose={deactivateModalUpload}
          onUpload={activateModalInstall}
        />
      )}

      {modalURL && (
        <ModalDownloadFromURL
          onClose={deactivateModalURL}
          onConfirm={activateModalInstall}
        />
      )}

      {modalInstall && (
        <ModalInstallPlugin source={source} onClose={deactivateModalInstall} />
      )}

      {action && !store.masterPassword && (
        <ModalMasterPassword onClose={() => setAction("")} />
      )}
    </>
  );
}

export default observer(StepDatabaseNoStore);
