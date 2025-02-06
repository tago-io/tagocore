import { observer } from "mobx-react";
import { useCallback, useMemo, useState } from "react";
import { useLoaderData, useNavigate } from "react-router";

import type { TStatusResponse } from "src/App.tsx";

import SetupBackground from "./SetupBackground/SetupBackground.tsx";
import StepDatabaseWrapper from "./StepDatabaseWrapper/StepDatabaseWrapper.tsx";
import StepMasterPassword from "./StepMasterPassword/StepMasterPassword.tsx";
import StepPluginConfigByID from "./StepPluginConfig/StepPluginConfig.tsx";
import StepSignUp from "./StepSignUp/StepSignUp.tsx";
import StepWelcome from "./StepWelcome/StepWelcome.tsx";

type TSetupStep =
  | "welcome"
  | "master-password"
  | "database-setup"
  | "plugin-settings"
  | "create-account";

type SetupLoaderData = { stepList: TSetupStep[] };

function Setup() {
  const { stepList } = useLoaderData() as SetupLoaderData;

  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [selectedDatabasePluginID, setSelectedDatabasePluginID] = useState<
    string | null
  >(null);

  const currentStep = useMemo(() => {
    return stepList[step] || null;
  }, [stepList, step]);

  const back = useCallback(() => {
    if (step > 1) {
      setStep(step - 1);
    }
  }, [step]);

  const next = useCallback(() => {
    if (currentStep === "create-account") {
      navigate("/console/login");
      return;
    }

    const nextStep = stepList[step + 1];
    if (nextStep) {
      setStep(step + 1);
    }
  }, [stepList, step, currentStep, navigate]);

  if (currentStep === "master-password") {
    return (
      <>
        <SetupBackground />
        <StepMasterPassword onBack={back} onNext={next} />
      </>
    );
  }

  if (
    currentStep === "database-setup" ||
    (currentStep === "plugin-settings" && !selectedDatabasePluginID)
  ) {
    return (
      <>
        <SetupBackground />
        <StepDatabaseWrapper
          onBack={back}
          onNext={next}
          onSelectDatabasePlugin={(pluginID) =>
            setSelectedDatabasePluginID(pluginID)
          }
        />
      </>
    );
  }

  if (currentStep === "plugin-settings" && selectedDatabasePluginID) {
    return (
      <>
        <SetupBackground />
        <StepPluginConfigByID
          pluginID={selectedDatabasePluginID}
          mustBeDatabasePlugin
          onNext={next}
          onBack={back}
        />
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

  return (
    <>
      <SetupBackground />
      <StepWelcome onNext={next} />
    </>
  );
}

export function getSetupSteps(status: TStatusResponse) {
  const stepList: TSetupStep[] = ["welcome"];

  if (!status.master_password) {
    stepList.push("master-password");
  }

  if (!status.database?.configured) {
    stepList.push("database-setup", "plugin-settings");
  }

  if (!status.account) {
    stepList.push("create-account");
  }

  return stepList;
}

export default observer(Setup);
