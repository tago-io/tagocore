import type { IPlugin } from "@tago-io/tcore-sdk/types";
import { flattenConfigFields } from "@tago-io/tcore-shared";
import { useCallback, useEffect, useMemo, useState } from "react";
import { promiseDelay } from "../../../Helpers/promiseDelay.ts";
import validateConfigFields from "../../../Helpers/validateConfigFields.ts";
import editPluginSettings from "../../../Requests/editPluginSettings.ts";
import editSettings from "../../../Requests/editSettings.ts";
import { usePluginInfo } from "../../../Requests/getPluginInfo.ts";
import {
  EButton,
  EIcon,
  EmptyMessage,
  FormGroup,
  Loading,
} from "../../../index.ts";
import PluginConfigFields from "../../Plugins/Common/PluginConfigFields/PluginConfigFields.tsx";
import Status from "../../Plugins/Common/Status/Status.tsx";
import SetupForm, { type SetupFormButton } from "../SetupForm/SetupForm.tsx";
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

interface StepPluginConfigProps {
  plugin: IPlugin | null;
  title?: string;
  description?: string;
  backButton?: SetupFormButton;
  isLoading?: boolean;
  mustBeDatabasePlugin?: boolean;
  onBack?: () => void;
}

export function StepPluginConfig(props: StepPluginConfigProps) {
  const {
    plugin,
    title = "Plugin Configuration",
    description = "Adjust the settings of your main Database Plugin",
    isLoading = false,
    mustBeDatabasePlugin = false,
    onBack,
  } = props;

  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, boolean>>({});
  const [formData, setFormData] = useState<Record<string, any>>({});

  const isLoadingPlugin = !plugin || isLoading || isSaving;

  const firstDatabaseModule = useMemo(() => {
    if (!plugin) {
      return null;
    }

    return plugin.modules.find((module) => module.type === "database") || null;
  }, [plugin]);

  const firstModule = useMemo(() => {
    if (mustBeDatabasePlugin) {
      return firstDatabaseModule;
    }

    return plugin?.modules?.[0] || null;
  }, [mustBeDatabasePlugin, firstDatabaseModule, plugin?.modules]);

  const isSaveDisabled = useMemo(() => {
    return (
      isLoadingPlugin ||
      (mustBeDatabasePlugin && plugin && !firstDatabaseModule)
    );
  }, [isLoadingPlugin, plugin, mustBeDatabasePlugin, firstDatabaseModule]);

  const setDefaultFormData = useCallback(
    (pluginInfo: IPlugin) => {
      if (!firstModule) {
        setErrorMessage(pluginInfo.error || "");
        setFormData({});
        return;
      }

      const flattenedConfigFields = flattenConfigFields(
        firstModule.configs ?? [],
      );

      const defaultFormData: Record<string, any> = {};
      for (const field of flattenedConfigFields) {
        if ("defaultValue" in field && field.defaultValue) {
          defaultFormData[field.field] = field.defaultValue;
        }
      }

      setErrorMessage(pluginInfo.error || "");
      setFormData(defaultFormData);
    },
    [firstModule],
  );

  const validate = useCallback(() => {
    const err = validateConfigFields(firstModule?.configs || [], formData);
    if (err !== null) {
      setFormErrors(err);
      return false;
    }

    setFormErrors({});
    return true;
  }, [formData, firstModule?.configs]);

  const save = useCallback(async () => {
    if (!validate()) {
      return;
    }

    if (!firstModule || !plugin) {
      return;
    }

    setIsSaving(true);
    setErrorMessage("");

    try {
      const editValues = Object.keys(formData).map((key) => ({
        moduleID: firstModule.id,
        field: key,
        value: formData[key],
        setupDatabase: true,
      }));

      await editPluginSettings(plugin?.id || "", editValues);

      // some artificial delay to give a better UX feel
      await promiseDelay(1000);
      await editSettings({ database_plugin: `${plugin.id}:${firstModule.id}` });

      setSuccess(true);
    } catch (error: any) {
      const msg = error?.response?.data?.message || error?.toString?.();
      setErrorMessage(msg);
    } finally {
      setIsSaving(false);
    }
  }, [plugin, formData, firstModule, validate]);

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

  useEffect(() => {
    if (plugin) {
      setDefaultFormData(plugin);
    }
  }, [plugin, setDefaultFormData]);

  return (
    <SetupForm
      title={title}
      description={description}
      loading={isLoadingPlugin}
      onRenderAfterFooter={renderSuccessMessage}
      buttons={[
        props.backButton
          ? { ...props.backButton, disabled: isLoadingPlugin }
          : { label: "Back", disabled: isLoadingPlugin, onClick: onBack },
        {
          label: "Save",
          disabled: isSaveDisabled,
          onClick: save,
          type: EButton.primary,
        },
      ]}
    >
      {mustBeDatabasePlugin && plugin && !firstDatabaseModule ? (
        <EmptyMessage
          icon={EIcon["exclamation-triangle"]}
          message="The selected plugin doesn't contain a database module"
        />
      ) : plugin ? (
        <>
          <ErrorStatus message={errorMessage} />
          <PluginConfigFields
            data={firstModule?.configs || []}
            errors={formErrors}
            onChangeValues={setFormData}
            values={formData}
          />
        </>
      ) : (
        <Loading />
      )}
    </SetupForm>
  );
}

export function StepPluginConfigByID(
  props: Omit<StepPluginConfigProps, "plugin"> & {
    pluginID: string;
  },
) {
  const { data: plugin, isLoading: isLoadingPlugin } = usePluginInfo(
    props.pluginID,
  );

  return (
    <StepPluginConfig
      {...props}
      plugin={plugin ?? null}
      isLoading={isLoadingPlugin}
    />
  );
}

function ErrorStatus(props: { message: string }) {
  if (!props.message) {
    return null;
  }

  return (
    <FormGroup>
      <Status
        color={"hsla(0, 100%, 44%, 0.1)"}
        icon={EIcon["exclamation-triangle"]}
        iconColor="hsl(0, 100%, 40%)"
        value={props.message}
      />
    </FormGroup>
  );
}
