import type { IPlugin } from "@tago-io/tcore-sdk/types";
import { observer } from "mobx-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { promiseDelay } from "../../../Helpers/promiseDelay.ts";
import setDocumentTitle from "../../../Helpers/setDocumentTitle.ts";
import getPluginDatabaseInfo from "../../../Requests/getPluginDatabaseInfo.ts";
import reloadPlugin from "../../../Requests/reloadPlugin.ts";
import store from "../../../System/Store.ts";
import { Button, EButton, EIcon, Icon } from "../../../index.ts";
import ModalFactoryReset from "../../Plugins/Common/ModalFactoryReset/ModalFactoryReset.tsx";
import ModalMasterPassword from "../../Plugins/Common/ModalMasterPassword/ModalMasterPassword.tsx";
import SetupBackground from "../SetupBackground/SetupBackground.tsx";
import SetupForm from "../SetupForm/SetupForm.tsx";
import { StepPluginConfig } from "../StepPluginConfig/StepPluginConfig.tsx";
import SuccessMessage from "../SuccessMessage/SuccessMessage.tsx";
import * as Style from "./StepDatabaseError.style";

function StepDatabaseError() {
  const [action, setAction] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showingConfigs, setShowingConfigs] = useState(false);
  const [modalReset, setModalReset] = useState(false);
  const [plugin, setPlugin] = useState<IPlugin | null>(null);
  const navigate = useNavigate();

  const showFactoryResetModal = useCallback(() => {
    setModalReset(true);
  }, []);

  const loadPlugin = useCallback(async () => {
    if (!plugin) {
      const plug = await getPluginDatabaseInfo();
      setPlugin(plug);
      return plug;
    }
    return plugin;
  }, [plugin]);

  const showConfigs = useCallback(async () => {
    setLoading(true);

    try {
      await loadPlugin();
      setShowingConfigs(true);
    } finally {
      setLoading(false);
    }
  }, [loadPlugin]);

  const retryConnection = useCallback(async () => {
    setLoading(true);

    try {
      const plug = await loadPlugin();
      await reloadPlugin(plug.id);
      await promiseDelay(500); // a bit of delay generates more 'trust'

      setSuccess(true);
    } catch (err: any) {
      // const errorMsg = err?.response?.data?.message || err?.toString?.();
      // console.error(errorMsg);
      // alert(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [loadPlugin]);

  const doAction = useCallback(
    (actionToDo: string) => {
      switch (actionToDo) {
        case "factory-reset":
          showFactoryResetModal();
          break;
        case "retry-conn":
          retryConnection();
          break;
        case "show-configs":
          showConfigs();
          break;
        default:
          break;
      }
      setAction("");
    },
    [showFactoryResetModal, retryConnection, showConfigs],
  );

  const renderSuccessMessage = useCallback(() => {
    if (!success) {
      return null;
    }

    return (
      <SuccessMessage
        title="Connected"
        description="The database plugin is connected and ready to be used"
        onClick={() => (window.location.href = "/")}
      />
    );
  }, [success]);

  const renderConfigHidden = () => {
    return (
      <Style.ConfigHidden>
        <Icon icon={EIcon["exclamation-triangle"]} size="50px" />

        <div className="texts">
          <span>Something went wrong with your main Database Plugin.</span>
          <span>Press the button below to view the error.</span>
        </div>

        <Button
          addIconMargin
          onClick={() => setAction("show-configs")}
          type={EButton.primary}
          disabled={loading}
        >
          <Icon icon={EIcon["pencil-alt"]} />
          <span>Edit Plugin Configuration</span>
        </Button>
      </Style.ConfigHidden>
    );
  };

  useEffect(() => {
    setDocumentTitle("Database Plugin Error");
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies(store.masterPassword): mobx observer
  useEffect(() => {
    if (action && store.masterPassword) {
      doAction(action);
    }
  }, [action, store.masterPassword, doAction]);

  /**
   * Goes to the main console route if there is no database error.
   */
  // biome-ignore lint/correctness/useExhaustiveDependencies(store.databaseError): mobx observer
  useEffect(() => {
    if (!store.databaseError) {
      navigate("/console");
    }
  }, [store.databaseError, navigate]);

  /**
   * Cleans up the master password after the screen ends.
   */
  useEffect(() => {
    return () => {
      store.masterPassword = "";
    };
  }, []);

  return (
    <>
      <SetupBackground />

      {showingConfigs && plugin ? (
        <StepPluginConfig
          title="Database Plugin Error"
          description=""
          plugin={plugin}
          backButton={{
            label: "Factory reset",
            disabled: loading,
            onClick: () => setAction("factory-reset"),
          }}
        />
      ) : (
        <SetupForm
          title="Database Plugin Error"
          loading={loading}
          onRenderAfterFooter={renderSuccessMessage}
          buttons={[
            {
              label: "Factory reset",
              disabled: loading,
              onClick: () => setAction("factory-reset"),
            },
            {
              label: "Retry Connection",
              disabled: loading,
              onClick: () => setAction("retry-conn"),
              type: EButton.primary,
            },
          ]}
        >
          {renderConfigHidden()}
        </SetupForm>
      )}

      {modalReset && <ModalFactoryReset onClose={() => setModalReset(false)} />}

      {action && !store.masterPassword && (
        <ModalMasterPassword onClose={() => setAction("")} />
      )}
    </>
  );
}

export default observer(StepDatabaseError);
