import type { IPlugin, IPluginModule } from "@tago-io/tcore-sdk/types";
import { useCallback, useState } from "react";
import Accordion from "../../../Accordion/Accordion.tsx";
import { EIcon } from "../../../Icon/Icon.types";
import PluginConfigFields from "../PluginConfigFields/PluginConfigFields.tsx";
import ModuleStatus from "../ModuleStatus/ModuleStatus.tsx";
import { getLocalStorageAsBoolean, setLocalStorage } from "../../../../Helpers/localStorage.ts";
import { FormGroup } from "../../../../index.ts";
import Status from "../Status/Status.tsx";
import * as Style from "./ModuleSetup.style";

/**
 * Props.
 */
interface ISetupConfigProps {
  /**
   */
  module: IPluginModule;
  /**
   */
  data: IPlugin;
  /**
   * The value for the fields.
   */
  values: any;
  /**
   * Called when a value of a field changes.
   */
  onChangeValues: (values: any) => void;
  /**
   * The error for the fields.
   */
  errors: any;
  /**
   * Called when this module gets started.
   */
  onStart: (module: IPluginModule) => Promise<void>;
  /**
   * Called when this module gets stopped.
   */
  onStop: (module: IPluginModule) => Promise<void>;
}

/**
 */
function ModuleSetup(props: ISetupConfigProps) {
  const { module, data, errors, values, onStart, onStop, onChangeValues } = props;
  const [open, setOpen] = useState(() => getLocalStorageAsBoolean(module.id, true));

  /**
   */
  const setValues = useCallback(
    (oldValues) => {
      onChangeValues({ [module.id]: { ...oldValues } });
    },
    [onChangeValues, module.id]
  );

  /**
   */
  const changeOpen = useCallback(
    (newOpen: boolean) => {
      setOpen(newOpen);
      setLocalStorage(module.id, String(newOpen));
    },
    [module.id]
  );

  /**
   * Returns the icon for a type of plugin.
   */
  const getIcon = (): EIcon => {
    switch (module.type) {
      case "database":
        return EIcon.database;
      case "action-trigger":
        return EIcon.bolt;
      case "action-type":
        return EIcon.bolt;
      case "filesystem":
        return EIcon.folder;
      default:
        return EIcon.cog;
    }
  };

  if (module.type === "encoder") {
    // encoder types do not get rendered.
    return null;
  }

  if (!module.configs || module.configs.length === 0) {
    // no configs
    return null;
  }

  return (
    <Style.Container>
      <Accordion
        description={`Module status: ${module.state}`}
        icon={getIcon()}
        key={module.id}
        onChangeOpen={changeOpen}
        open={open}
        title={module.name || module.id}
      >
        {module.message && (
          <FormGroup>
            <Status
              icon={module.message.icon}
              color={module.message.color}
              iconColor={module.message.iconColor}
              value={module.message.message}
            />
          </FormGroup>
        )}

        <ModuleStatus
          onStart={() => onStart(module)}
          onStop={() => onStop(module)}
          data={data}
          module={module}
        />

        <PluginConfigFields
          data={module.configs || []}
          errors={errors?.[module.id] || {}}
          onChangeValues={setValues}
          values={values?.[module.id] || {}}
        />
      </Accordion>
    </Style.Container>
  );
}

export default ModuleSetup;
