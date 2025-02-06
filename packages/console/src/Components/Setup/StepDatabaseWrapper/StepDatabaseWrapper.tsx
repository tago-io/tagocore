import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import store from "../../../System/Store.ts";
import { EIcon, EmptyMessage, Loading } from "../../../index.ts";
import ModalMasterPassword from "../../Plugins/Common/ModalMasterPassword/ModalMasterPassword.tsx";
import SetupForm from "../SetupForm/SetupForm.tsx";
import StepDatabaseWithStore from "../StepDatabaseWithStore/StepDatabaseWithStore.tsx";

interface StepDatabaseSetup {
  onBack: () => void;
  onNext: () => void;
  onSelectDatabasePlugin: (pluginID: string) => void;
}

/**
 * Wrapper of the database step to figure out which screen to show:
 *
 * - the database selection without the plugin store.
 * - or the database selection with the plugin store.
 */
function StepDatabaseWrapper(props: StepDatabaseSetup) {
  const { onBack, onNext, onSelectDatabasePlugin } = props;

  const [checkPassword, setCheckPassword] = useState(true);

  // biome-ignore lint/correctness/useExhaustiveDependencies(store.masterPassword): mobx observer
  useEffect(() => {
    if (store.masterPassword) {
      setCheckPassword(false);
    }
  }, [store.masterPassword]);

  return (
    <>
      {!store.masterPassword ? (
        <SetupForm
          title="Pick a Database Plugin"
          description="A Database plugin is used to store data from your devices"
        >
          {!checkPassword && !store.masterPassword ? (
            <EmptyMessage icon={EIcon.lock} message="Invalid master password" />
          ) : (
            <Loading />
          )}
        </SetupForm>
      ) : (
        <StepDatabaseWithStore
          onBack={onBack}
          onNext={onNext}
          onSelectDatabasePlugin={onSelectDatabasePlugin}
        />
      )}

      {checkPassword && !store.masterPassword && (
        <ModalMasterPassword onClose={() => setCheckPassword(false)} />
      )}
    </>
  );
}

export default observer(StepDatabaseWrapper);
