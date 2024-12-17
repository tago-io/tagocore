import { observer } from "mobx-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import setDocumentTitle from "../../Helpers/setDocumentTitle.ts";
import store from "../../System/Store.ts";
import SetupBackground from "./SetupBackground/SetupBackground.tsx";
import StepDatabaseWrapper from "./StepDatabaseWrapper/StepDatabaseWrapper.tsx";
import StepMasterPassword from "./StepMasterPassword/StepMasterPassword.tsx";
import { StepPluginConfigByID } from "./StepPluginConfig/StepPluginConfig.tsx";
import StepSignUp from "./StepSignUp/StepSignUp.tsx";
import StepWelcome from "./StepWelcome/StepWelcome.tsx";

type TSetupStep =
  | "welcome"
  | "master-password"
  | "database-setup"
  | "plugin-settings"
  | "create-account";

/**
 * Main setup component.
 */
function Setup() {
  const [step, setStep] = useState(0);
  const [pluginID, setPluginID] = useState<string | null>(null);
  const [readyToRender, setReadyToRender] = useState(false);

  const navigate = useNavigate();

  // biome-ignore lint/correctness/useExhaustiveDependencies: mobx observers
  const steps = useMemo(() => {
    const stepList: TSetupStep[] = ["welcome"];

    if (!store.masterPasswordConfigured) {
      stepList.push("master-password");
    }

    if (!store.databaseConfigured) {
      stepList.push("database-setup");
    }

    if (pluginID) {
      stepList.push("plugin-settings");
    }

    if (!store.accountConfigured) {
      stepList.push("create-account");
    }

    return stepList;
  }, [
    store.masterPasswordConfigured,
    store.databaseConfigured,
    store.accountConfigured,
    pluginID,
  ]);

  const currentStep = useMemo(() => {
    return steps[step] || null;
  }, [steps, step]);

  const next = useCallback(
    (param: any) => {
      if (currentStep === "master-password") {
        store.masterPasswordConfigured = true;
        store.masterPassword = param as string;
      } else if (currentStep === "database-setup") {
        setPluginID(param as string);
        setStep((state) => state + 1);
      } else if (step === steps.length - 1) {
        navigate("/console/login");
      } else {
        setStep((state) => state + 1);
      }
    },
    [steps, currentStep, step, navigate],
  );

  const back = useCallback(() => {
    setStep(step - 1);
  }, [step]);

  /**
   * Sets the document title.
   */
  useEffect(() => {
    if (steps.length === 1) {
      navigate("/console");
    } else if (steps.length === 2 && steps[1] === "create-account") {
      setReadyToRender(true);
      setStep(1);
    } else {
      setReadyToRender(true);
      setDocumentTitle("Setup");
    }
  }, [steps, navigate]);

  useEffect(() => {
    if (!currentStep) {
      navigate("/console");
    }
  }, [currentStep, navigate]);

  if (!readyToRender || !currentStep) {
    return null;
  }

  if (currentStep === "master-password") {
    return (
      <>
        <SetupBackground />
        <StepMasterPassword onBack={back} onNext={next} />
      </>
    );
  }

  if (currentStep === "database-setup") {
    return (
      <>
        <SetupBackground />
        <StepDatabaseWrapper onBack={back} onNext={next} />
      </>
    );
  }

  if (currentStep === "create-account") {
    return (
      <>
        <SetupBackground />
        <StepSignUp onBack={back} onNext={next} />
      </>
    );
  }

  if (currentStep === "plugin-settings" && pluginID) {
    return (
      <>
        <SetupBackground />
        <StepPluginConfigByID
          pluginID={pluginID}
          mustBeDatabasePlugin
          onBack={back}
        />
      </>
    );
  }

  return (
    <>
      <SetupBackground />
      <StepWelcome onNext={next} />
    </>
  );
}

export default observer(Setup);
