import { observer } from "mobx-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import setDocumentTitle from "../../Helpers/setDocumentTitle.ts";
import store from "../../System/Store.ts";
import SetupBackground from "./SetupBackground/SetupBackground.tsx";
import StepDatabaseWrapper from "./StepDatabaseWrapper/StepDatabaseWrapper.tsx";
import StepMasterPassword from "./StepMasterPassword/StepMasterPassword.tsx";
import StepPluginConfig from "./StepPluginConfig/StepPluginConfig.tsx";
import StepSignUp from "./StepSignUp/StepSignUp.tsx";
import StepWelcome from "./StepWelcome/StepWelcome.tsx";

/**
 * Main setup component.
 */
function Setup() {
  const [step, setStep] = useState(0);
  const [pluginID, setPluginID] = useState<any>(null);
  const [readyToRender, setReadyToRender] = useState(false);
  const navigate = useNavigate();

  /**
   */
  const steps = [StepWelcome];

  if (!store.masterPasswordConfigured) {
    steps.push(StepMasterPassword);
  }
  if (!store.databaseConfigured) {
    steps.push(StepDatabaseWrapper);
  }
  if (pluginID) {
    steps.push(StepPluginConfig);
  }
  if (!store.accountConfigured) {
    steps.push(StepSignUp);
  }

  const SetupComponent = steps[step];

  /**
   */
  const next = useCallback(
    (param: any) => {
      if (SetupComponent === StepMasterPassword) {
        store.masterPasswordConfigured = true;
        store.masterPassword = param as string;
      } else if (SetupComponent === StepDatabaseWrapper) {
        setPluginID(param as string);
        setStep(step + 1);
      } else if (step === steps.length - 1) {
        navigate("/console/login");
      } else {
        setStep(step + 1);
      }
    },
    [navigate, steps.length, SetupComponent, step],
  );

  /**
   */
  const back = useCallback(() => {
    setStep(step - 1);
  }, [step]);

  /**
   * Sets the document title.
   */
  useEffect(() => {
    if (steps.length === 1) {
      navigate("/console");
    } else if (steps.length === 2 && steps[1] === StepSignUp) {
      setReadyToRender(true);
      setStep(1);
    } else {
      setReadyToRender(true);
      setDocumentTitle("Setup");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   */
  useEffect(() => {
    if (!SetupComponent) {
      navigate("/console");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [SetupComponent]);

  if (!readyToRender || !SetupComponent) {
    return null;
  }

  return (
    <>
      <SetupBackground />
      <SetupComponent
        onBack={back}
        onNext={next}
        pluginID={pluginID} // for SetupDatabaseWrapper
        mustBeDatabasePlugin // for StepPluginConfig
      />
    </>
  );
}

export default observer(Setup);
