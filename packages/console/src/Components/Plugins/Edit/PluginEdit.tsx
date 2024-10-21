import type { IPlugin, IPluginModule } from "@tago-io/tcore-sdk/types";
import { useCallback, useEffect, useRef, useState } from "react";
import { useHistory, useRouteMatch } from "react-router";
import { useTheme } from "styled-components";
import cloneDeep from "lodash.clonedeep";
import { flattenConfigFields } from "@tago-io/tcore-shared";
import { observer } from "mobx-react";
import EditPage from "../../EditPage/EditPage.tsx";
import PluginImage from "../../PluginImage/PluginImage.tsx";
import uninstallPlugin from "../../../Requests/uninstallPlugin.ts";
import editPluginSettings from "../../../Requests/editPluginSettings.ts";
import removeEmptyKeys from "../../../Helpers/removeEmptyKeys.ts";
import validateConfigFields from "../../../Helpers/validateConfigFields.ts";
import startPluginModule from "../../../Requests/startPluginModule.ts";
import stopPluginModule from "../../../Requests/stopPluginModule.ts";
import enablePlugin from "../../../Requests/enablePlugin.ts";
import disablePlugin from "../../../Requests/disablePlugin.ts";
import store from "../../../System/Store.ts";
import { getSocket } from "../../../System/Socket.ts";
import SettingsTab from "./SettingsTab/SettingsTab.tsx";

/**
 * The plugin's edit page.
 */
function PluginEdit() {
  const match = useRouteMatch<{ id: string }>();
  const history = useHistory();
  const { id } = match.params;

  const theme = useTheme();
  const [data, setData] = useState<IPlugin>({} as IPlugin);
  const [tabIndex, setTabIndex] = useState(0);
  const [values, setValues] = useState<any>({});
  const [errors, setErrors] = useState<{ [key: string]: any }>({});

  const loading = !data.id;
  const initialValues = useRef<any>({});

  /**
   * Called when the record was fetched by the edit page.
   * We use this to set the data state to manipulate the object.
   */
  const onFetch = useCallback((plugin: IPlugin) => {
    const newValues: any = {};

    for (const module of plugin.modules) {
      newValues[module.id] = {};

      const flattened = flattenConfigFields(module.configs || []);
      for (const field of flattened) {
        if ("defaultValue" in field) {
          if (field.defaultValue === 0) {
            newValues[module.id][field.field] = "0";
          } else {
            newValues[module.id][field.field] = field.defaultValue;
          }
        }
      }
    }

    initialValues.current = cloneDeep(newValues);
    setValues(newValues);
    setData(plugin);
  }, []);

  /**
   * Validates the form data to make sure the object is not faulty.
   * This should return a boolean to indicate if the data is correct or not.
   */
  const validate = useCallback(async () => {
    const allErrors: any = {};
    let hasError = false;

    for (const module of data.modules) {
      const moduleConfigs = module.configs || [];
      const moduleValues = values[module.id];

      allErrors[module.id] = validateConfigFields(moduleConfigs, moduleValues);
      if (allErrors[module.id] !== null) {
        hasError = true;
      }
    }

    if (hasError) {
      setErrors(allErrors);
      return false;
    }

    setErrors({});
    return true;
  }, [data.modules, values]);

  /**
   * Enables the plugin again.
   */
  const enable = useCallback(async () => {
    enablePlugin(id);
  }, [id]);

  /**
   * Disable the entire plugin.
   */
  const disable = useCallback(async () => {
    disablePlugin(id);
  }, [id]);

  /**
   */
  const stopModule = useCallback(
    async (module: IPluginModule) => {
      stopPluginModule(data.id, module.id);
    },
    [data]
  );

  /**
   */
  const startModule = useCallback(
    async (module: IPluginModule) => {
      startPluginModule(data.id, module.id);
    },
    [data]
  );

  /**
   * Renders the `Settings` tab's content.
   */
  const renderSettingsTab = () => {
    return (
      <SettingsTab
        data={data}
        errors={errors}
        onChangeValues={setValues}
        onStartModule={startModule}
        onStopModule={stopModule}
        onUninstall={uninstall}
        values={values}
        onEnable={enable}
        onDisable={disable}
      />
    );
  };

  /**
   * Saves the plugin.
   */
  const save = useCallback(async () => {
    const editValues = [];
    for (const key in values) {
      if (values[key]) {
        for (const field in values[key]) {
          if (values[key][field] !== undefined) {
            editValues.push({ moduleID: key, field, value: values[key][field] });
          }
        }
      }
    }

    try {
      await editPluginSettings(id, editValues);
    } finally {
      initialValues.current = cloneDeep(values);
    }
  }, [id, values]);

  /**
   * Uninstalls the plugin.
   */
  const uninstall = useCallback(
    async (keepData: boolean) => {
      await uninstallPlugin(id, keepData);
    },
    [id]
  );

  /**
   * Should return if the initial data is different from the current data.
   */
  const checkIfDataChanged = useCallback(() => {
    return (
      JSON.stringify(removeEmptyKeys(values)) !==
      JSON.stringify(removeEmptyKeys(initialValues.current))
    );
  }, [values]);

  /**
   */
  useEffect(() => {
    function onModuleStatus(params: any) {
      const module = data.modules.find((x) => x.id === params.id);
      if (module) {
        module.state = params.state;
        module.error = params.error;
        module.message = params.message;
        setData({ ...data });
      }
    }

    function onPluginStatus(params: any) {
      if (params?.id === id) {
        if (params.deleted) {
          history.push("/console");
          return;
        }
        data.state = params.state;
        data.error = params.error;
        setData({ ...data });
      }
    }

    getSocket().on("module::status", onModuleStatus);
    getSocket().on("plugin::status", onPluginStatus);
    return () => {
      getSocket().off("module::status", onModuleStatus);
      getSocket().off("plugin::status", onPluginStatus);
    };
  });

  /**
   * Attaches the events to listen to the modules.
   */
  useEffect(() => {
    if (store.socketConnected && data.id) {
      for (const module of data.modules) {
        getSocket().emit("attach", "module", module.id);
      }
      return () => {
        for (const module of data.modules) {
          getSocket().emit("unattach", "module", module.id);
        }
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.socketConnected, data.id]);

  return (
    <EditPage<IPlugin>
      color={theme.extension}
      documentTitle={data.name ? `${data.name} - Plugin Configuration` : ""}
      onRenderInnerNavIcon={() => (
        <PluginImage src={data.id ? `/images/${data.id}/icon` : null} width={30} />
      )}
      innerNavTitle={data.name ? `${data.name} - Plugin Configuration` : ""}
      loading={loading}
      description={data.short_description}
      onChangeTabIndex={setTabIndex}
      onCheckIfDataChanged={checkIfDataChanged}
      onFetch={onFetch}
      onSave={save}
      onValidate={validate}
      requestPath="plugin"
      tabIndex={tabIndex}
      tabs={[
        {
          label: "Settings",
          content: renderSettingsTab(),
        },
      ]}
    />
  );
}

export default observer(PluginEdit);
