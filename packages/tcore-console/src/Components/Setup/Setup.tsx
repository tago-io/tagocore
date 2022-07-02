import { useEffect, useState, useCallback } from "react";
import { useHistory } from "react-router";
import { observer } from "mobx-react";
import setDocumentTitle from "../../Helpers/setDocumentTitle";
import store from "../../System/Store";
import StepDatabaseWrapper from "./StepDatabaseWrapper/StepDatabaseWrapper";
import StepWelcome from "./StepWelcome/StepWelcome";
import SetupBackground from "./SetupBackground/SetupBackground";
import StepSignUp from "./StepSignUp/StepSignUp";
import StepMasterPassword from "./StepMasterPassword/StepMasterPassword";
import StepPluginConfig from "./StepPluginConfig/StepPluginConfig";

/**
 * Main setup component.
 */
function Setup() {
  const [step, setStep] = useState(0);
  const [pluginID, setPluginID] = useState<any>(null);
  const [readyToRender, setReadyToRender] = useState(false);
  const history = useHistory();

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
        history.push("/console/login");
      } else {
        setStep(step + 1);
      }
    },
    [history, steps.length, SetupComponent, step]
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
      history.push("/console");
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
      history.push("/console");
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
