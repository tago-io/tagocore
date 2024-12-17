import type { IPlugin } from "@tago-io/tcore-sdk/types";
import { flattenConfigFields } from "@tago-io/tcore-shared";
import { useCallback, useEffect, useMemo, useState } from "react";
import { promiseDelay } from "../../../Helpers/promiseDelay.ts";
import validateConfigFields from "../../../Helpers/validateConfigFields.ts";
import editPluginSettings from "../../../Requests/editPluginSettings.ts";
import editSettings from "../../../Requests/editSettings.ts";
import getPluginInfo from "../../../Requests/getPluginInfo.ts";
import {
  EButton,
  EIcon,
  EmptyMessage,
  FormGroup,
  Loading,
} from "../../../index.ts";
import PluginConfigFields from "../../Plugins/Common/PluginConfigFields/PluginConfigFields.tsx";
import Status from "../../Plugins/Common/Status/Status.tsx";
import SetupForm from "../SetupForm/SetupForm.tsx";
import SuccessMessage from "../SuccessMessage/SuccessMessage.tsx";

interface IStepPluginConfigProps {
  backButton?: any;
  description?: string;
  mustBeDatabasePlugin?: boolean;
  plugin?: IPlugin;
  pluginID?: string;
  title?: string;
  onBack?: () => void;
}

function StepPluginConfig(props: IStepPluginConfigProps) {
  const {
    mustBeDatabasePlugin,
    pluginID,
    onBack,
    title,
    backButton,
    description,
  } = props;

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [plugin, setPlugin] = useState<IPlugin | null>(
    () => props.plugin || null,
  );
  const [errors, setErrors] = useState<any>({});
  const [values, setValues] = useState<any>({});

  const mod = useMemo(() => {
    const pluginMods = plugin?.modules || [];

    const firstDbModule = pluginMods.find((plug) => plug.type === "database");

    return firstDbModule || pluginMods[0];
  }, [plugin?.modules]);

  const load = loading || !plugin;

  const loadPluginManually = useCallback(async (id: string) => {
    const plug = await getPluginInfo(id);
    setPlugin(plug);
  }, []);

  const renderErrorStatus = useCallback(() => {
    if (!errorMessage) {
      return null;
    }

    return (
      <FormGroup>
        <Status
          color={"hsla(0, 100%, 44%, 0.1)"}
          icon={EIcon["exclamation-triangle"]}
          iconColor="hsl(0, 100%, 40%)"
          value={errorMessage}
        />
      </FormGroup>
    );
  }, [errorMessage]);

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

  const save = useCallback(async () => {
    if (!validate()) {
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const editValues = Object.keys(values).map((key) => ({
        moduleID: mod?.id,
        field: key,
        value: values[key],
        setupDatabase: true,
      }));

      await editPluginSettings(plugin?.id || "", editValues);
      await promiseDelay(1000); // a bit of delay generates more 'trust'
      await editSettings({ database_plugin: `${plugin?.id}:${mod?.id}` });

      setSuccess(true);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.toString?.();
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  }, [plugin, values, mod?.id]);

  const setDefaultValues = useCallback(
    (options: {
      plugin: IPlugin | null;
    }) => {
      const flattened = flattenConfigFields(
        (options.plugin as any)?.configs || [],
      );
      for (const field of flattened) {
        if ("defaultValue" in field && field.defaultValue) {
          values[field.field] = field.defaultValue;
        }
      }

      setErrorMessage(options.plugin?.error || "");
      setValues({ ...values });
    },
    [values],
  );

  /**
   * Validates the form data to make sure the object is not faulty.
   * This should return a boolean to indicate if the data is correct or not.
   */
  const validate = () => {
    const err = validateConfigFields(mod?.configs || [], values);
    if (err !== null) {
      setErrors(err);
      return false;
    }

    setErrors({});
    return true;
  };

  useEffect(() => {
    if (plugin) {
      setDefaultValues({ plugin });
    }
  }, [plugin, setDefaultValues]);

  useEffect(() => {
    if (pluginID) {
      loadPluginManually(pluginID);
    }
  }, [pluginID, loadPluginManually]);

  const hasDatabaseModule = plugin?.modules?.some((x) => x.type === "database");

  return (
    <SetupForm
      title={title ?? "Plugin Configuration"}
      description={
        description ?? "Adjust the settings of your main Database Plugin"
      }
      loading={load}
      onRenderAfterFooter={renderSuccessMessage}
      buttons={[
        backButton
          ? { ...backButton, disabled: load }
          : { label: "Back", disabled: load, onClick: onBack },
        {
          label: "Save",
          disabled:
            load || (mustBeDatabasePlugin && plugin && !hasDatabaseModule),
          onClick: save,
          type: EButton.primary,
        },
      ]}
    >
      {mustBeDatabasePlugin && plugin && !hasDatabaseModule ? (
        <EmptyMessage
          icon={EIcon["exclamation-triangle"]}
          message="The selected plugin doesn't contain a database module"
        />
      ) : plugin ? (
        <>
          {renderErrorStatus()}
          <PluginConfigFields
            data={mod?.configs || []}
            errors={errors}
            onChangeValues={setValues}
            values={values}
          />
        </>
      ) : (
        <Loading />
      )}
    </SetupForm>
  );
}

export default StepPluginConfig;
