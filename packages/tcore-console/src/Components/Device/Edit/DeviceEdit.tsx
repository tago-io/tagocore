import {
  ESocketResource,
  IDevice,
  ILiveInspectorMessage,
  IDeviceParameter,
  IDeviceToken,
  zDevice,
  zDeviceParameter,
  IPluginClassListItem,
} from "@tago-io/tcore-sdk/types";
import cloneDeep from "lodash.clonedeep";
import { useEffect, useCallback, useState, useRef } from "react";
import { useRouteMatch } from "react-router";
import { useTheme } from "styled-components";
import { z } from "zod";
import { observer } from "mobx-react";
import normalizeTags from "../../../Helpers/normalizeTags";
import useApiRequest from "../../../Helpers/useApiRequest";
import buildZodError from "../../../Validation/buildZodError";
import EditPage from "../../EditPage/EditPage";
import Icon from "../../Icon/Icon";
import { EIcon } from "../../Icon/Icon.types";
import Switch from "../../Switch/Switch";
import TagsTab from "../../Tags/TagsTab";
import DeviceInputOutput from "../Common/DeviceInputOutput";
import normalizeConfigParameters from "../Helpers/normalizeConfigParameters";
import { IInspectorData } from "../Common/LiveInspector/LiveInspector.types";
import { socket } from "../../../System/Socket";
import setDeviceParams from "../../../Requests/setDeviceParams";
import createDeviceToken from "../../../Requests/createDeviceToken";
import deleteDevice from "../../../Requests/deleteDevice";
import deleteDeviceToken from "../../../Requests/deleteDeviceToken";
import editDevice from "../../../Requests/editDevice";
import { setLocalStorageAsJSON } from "../../../Helpers/localStorage";
import getDeviceTypeName from "../../../Helpers/getDeviceTypeName";
import ConfigParametersTab from "./ConfigParametersTab/ConfigParametersTab";
import GeneralInformationTab from "./GeneralInformationTab/GeneralInformationTab";
import LiveInspectorTab from "./LiveInspectorTab/LiveInspectorTab";
import MoreTab from "./MoreTab/MoreTab";

/**
 * The device's edit page.
 */
function DeviceEdit() {
  const match = useRouteMatch<{ id: string }>();
  const { id } = match.params;

  const theme = useTheme();
  const [data, setData] = useState<IDevice>({} as IDevice);
  const [tabIndex, setTabIndex] = useState(0);
  const [errors, setErrors] = useState<any>({});
  const [params, setParams] = useState<IDeviceParameter[]>();
  const [tokens, setTokens] = useState<IDeviceToken[]>();
  const [inspectorData, setInspectorData] = useState<IInspectorData>({
    enabled: false,
    limit: 25,
    logs: {},
  });
  const { data: encoderModules } = useApiRequest<IPluginClassListItem[]>("/module?type=encoder");
  const { data: apiTokens, mutate: mutateApiTokens } = useApiRequest<IDeviceToken[]>(
    `/device/token/${id}`
  );
  const { data: apiParams, mutate: mutateApiParams } = useApiRequest<IDeviceParameter[]>(
    `/device/${id}/params`
  );
  const initialData = useRef<IDevice>({} as IDevice);
  const intervalInspectorAttach = useRef<any>(null);

  const loading = !encoderModules || !data.id || !tokens || !params;

  /**
   * Called when the record was fetched by the edit page.
   * We use this to set the data state to manipulate the object.
   */
  const onFetch = useCallback((device: IDevice) => {
    setData(device);
    initialData.current = cloneDeep(device);
  }, []);

  /**
   * Validates the form data to make sure the object is not faulty.
   * This should return a boolean to indicate if the data is correct or not.
   */
  const validate = useCallback(async () => {
    try {
      await z
        .object({
          parameters: z.array((zDeviceParameter as any).omit({ id: true })),
        })
        .parseAsync({
          parameters: normalizeConfigParameters(params),
        });
    } catch (ex: any) {
      const err = buildZodError(ex.issues);
      if (err.parameters) {
        setErrors(err);
        setTabIndex(2);
        return false;
      }
    }

    try {
      await zDevice.parseAsync({
        ...data,
        tags: normalizeTags(data.tags),
        created_at: new Date(data.created_at),
        updated_at: new Date(data.updated_at as Date),
        last_input: new Date(data.last_input as Date),
        last_output: new Date(data.last_output as Date),
        inspected_at: undefined,
      });

      setErrors({});

      return true;
    } catch (ex: any) {
      const err = buildZodError(ex.issues);
      if (err.tags) {
        setTabIndex(3);
      } else {
        setTabIndex(0);
      }
      setErrors(err);
      return false;
    }
  }, [params, data]);

  /**
   * Saves the device.
   */
  const save = useCallback(async () => {
    const formatted = {
      active: data.active,
      id: data.id,
      name: data.name,
      payload_parser: data.payload_parser,
      tags: normalizeTags(data.tags),
      encoder_stack: data.encoder_stack || [],
    };

    await editDevice(id, formatted);
    await setDeviceParams(data.id, normalizeConfigParameters(params) as any);

    await mutateApiParams(() => params, false);
    await mutateApiTokens(() => tokens, false);

    setLocalStorageAsJSON("last-encoder-stack", formatted.encoder_stack);

    initialData.current = cloneDeep(data);
  }, [mutateApiTokens, id, tokens, params, mutateApiParams, data]);

  /**
   * Deletes the device.
   */
  const deleteData = useCallback(async () => {
    await deleteDevice(id);
  }, [id]);

  /**
   * Clears the whole inspector data.
   */
  const clearInspector = useCallback(() => {
    setInspectorData({ ...inspectorData, logs: {} });
  }, [inspectorData]);

  /**
   * Stops the live inspector.
   */
  const stopInspector = useCallback(() => {
    socket.emit("detach", ESocketResource.deviceInspection, id);
    socket.off("device::inspection");
    clearInterval(intervalInspectorAttach.current);
  }, [id]);

  /**
   * Called when the inspector receives a new message.
   */
  const onInspectorMessage = useCallback(
    (msg: ILiveInspectorMessage | ILiveInspectorMessage[]) => {
      if (Array.isArray(msg)) {
        for (const item of msg) {
          inspectorData.logs[item.connection_id] = inspectorData.logs[item.connection_id] || [];
          inspectorData.logs[item.connection_id].push(item);
        }
      } else {
        inspectorData.logs[msg.connection_id] = inspectorData.logs[msg.connection_id] || [];
        inspectorData.logs[msg.connection_id].push(msg);
      }
      setInspectorData({ ...inspectorData, logs: { ...inspectorData.logs } });
    },
    [inspectorData]
  );

  /**
   * Called when a field from a tab gets modified.
   * This will apply the change to the data state.
   */
  const onChangeData = useCallback(
    (field: keyof IDevice, value: IDevice[keyof IDevice]) => {
      setData({ ...data, [field]: value });
    },
    [data]
  );

  /**
   * Renders the `Live Inspector` tab's title.
   */
  const renderLiveInspectorTitle = () => {
    return (
      <>
        <Icon
          icon={EIcon.circle}
          size="10px"
          color={inspectorData.enabled ? "green" : theme.liveInspectorCircle}
        />
        <span>&nbsp;&nbsp;Live Inspector</span>
      </>
    );
  };

  /**
   * Renders the `Live Inspector` tab's content.
   */
  const renderLiveInspectorTab = () => {
    return (
      <LiveInspectorTab
        data={data}
        enabled={inspectorData.enabled}
        limit={inspectorData.limit}
        logs={inspectorData.logs}
        onChangeEnabled={(enabled) => setInspectorData({ ...inspectorData, enabled })}
        onChangeLimit={(limit) => setInspectorData({ ...inspectorData, limit })}
        onClear={clearInspector}
      />
    );
  };

  /**
   * Renders the `General Information` tab's content.
   */
  const renderGeneralInformationTab = () => {
    return (
      <GeneralInformationTab
        data={data}
        encoderModules={encoderModules}
        errors={errors}
        onChange={onChangeData}
        onChangeTokens={setTokens}
        onDeleteToken={deleteDeviceToken}
        onGenerateToken={generateToken as any}
        tokens={tokens}
      />
    );
  };

  /**
   * Renders the `Configuration Parameters` tab's content.
   */
  const renderConfigParamsTab = () => {
    return <ConfigParametersTab errors={errors} params={params} onChangeParams={setParams} />;
  };

  /**
   * Renders the `Tags` tab's content.
   */
  const renderTagsTab = () => {
    return (
      <TagsTab
        data={data.tags}
        errors={errors?.tags}
        name="device"
        onChange={(tags) => onChangeData("tags", tags)}
      />
    );
  };

  /**
   * Renders the page's nav description.
   */
  const renderDescription = () => {
    return (
      <>
        <span>Last Input </span>
        <DeviceInputOutput bold value={data.last_input} />
        <span> &nbsp;|&nbsp; </span>
        <span>Last Output </span>
        <DeviceInputOutput bold value={data.last_output} />
        <span> &nbsp;|&nbsp; </span>
        <span>Bucket </span>
        <b>{data.name}</b>

        <span> &nbsp;|&nbsp; </span>
        <span>Type </span>
        <b>{getDeviceTypeName(data.type)}</b>
      </>
    );
  };

  /**
   * Renders the `More` tab.
   */
  const renderMoreTab = useCallback(() => {
    return <MoreTab data={data} onDelete={deleteData} />;
  }, [data, deleteData]);

  /**
   * Renders the right side of the inner nav.
   */
  const renderInnerNav = useCallback(() => {
    if (loading) {
      // still loading
      return null;
    }

    return (
      <Switch value={data.active} onChange={(e) => onChangeData("active", e)}>
        Active
      </Switch>
    );
  }, [loading, onChangeData, data]);

  /**
   * Should return if the initial data is different from the current data.
   */
  const checkIfDataChanged = useCallback(() => {
    // the initial data, but normalized:
    const initialDataNormalized = {
      ...initialData.current,
      tags: normalizeTags(initialData.current.tags),
    };

    // the current data being edited, but normalized:
    const currentDataNormalized = {
      ...data,
      tags: normalizeTags(data.tags),
    };

    const initialParameters = normalizeConfigParameters(apiParams);
    const currentParameters = normalizeConfigParameters(params);

    return (
      JSON.stringify(initialDataNormalized) !== JSON.stringify(currentDataNormalized) ||
      JSON.stringify(initialParameters) !== JSON.stringify(currentParameters)
    );
  }, [data, apiParams, params]);

  /**
   * Used to transfer the tokens API data to the state data.
   */
  useEffect(() => {
    if (apiTokens) {
      setTokens(apiTokens);
    }
  }, [apiTokens]);

  /**
   * Used to transfer the params API data to the state data.
   */
  useEffect(() => {
    if (apiParams) {
      setParams(JSON.parse(JSON.stringify(apiParams)));
    }
  }, [apiParams]);

  /**
   * Called to attach the live inspector events or shutdown the live inspector socket link.
   * This effect will trigger when the `inspectorData.enabled` changes.
   */
  useEffect(() => {
    if (inspectorData.enabled) {
      if (intervalInspectorAttach.current) {
        clearInterval(intervalInspectorAttach.current);
      }

      intervalInspectorAttach.current = setInterval(() => {
        socket.emit("attach", "device", id);
      }, 30000); // 30 seconds

      socket.emit("attach", ESocketResource.deviceInspection, id);
      socket.off("device::inspection");
      socket.on("device::inspection", onInspectorMessage);
    } else {
      stopInspector();
    }
    return () => stopInspector();
  });

  return (
    <EditPage<IDevice>
      color={theme.device}
      description={renderDescription()}
      documentTitle="Device"
      icon={EIcon.device}
      innerNavTitle={data.name || "Device"}
      loading={loading}
      onChangeTabIndex={setTabIndex}
      onCheckIfDataChanged={checkIfDataChanged}
      onFetch={onFetch}
      onRenderInnerNav={renderInnerNav}
      onSave={save}
      onValidate={validate}
      requestPath="device"
      tabIndex={tabIndex}
      tabs={[
        {
          label: "General Information",
          content: renderGeneralInformationTab(),
        },
        {
          label: renderLiveInspectorTitle(),
          content: renderLiveInspectorTab(),
        },
        {
          label: "Configuration Parameters",
          content: renderConfigParamsTab(),
        },
        {
          label: "Tags",
          content: renderTagsTab(),
        },
        {
          label: "More",
          content: renderMoreTab(),
        },
      ]}
    />
  );
}

/**
 * Makes the request to generate a token for the device.
 */
async function generateToken(data: any) {
  return createDeviceToken(data.device_id, data);
}

export default observer(DeviceEdit);
