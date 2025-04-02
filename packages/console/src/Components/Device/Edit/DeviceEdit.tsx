import {
  type IDevice,
  type IDeviceParameter,
  type IDeviceToken,
  type ILiveInspectorMessage,
  type IPluginClassListItem,
  zDevice,
  zDeviceParameter,
} from "@tago-io/tcore-sdk/types";
import cloneDeep from "lodash.clonedeep";
import { observer } from "mobx-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useMatch } from "react-router";
import { useTheme } from "styled-components";
import { z } from "zod";
import getDeviceTypeName from "../../../Helpers/getDeviceTypeName.ts";
import { setLocalStorageAsJSON } from "../../../Helpers/localStorage.ts";
import normalizeTags from "../../../Helpers/normalizeTags.ts";
import useApiRequest from "../../../Helpers/useApiRequest.ts";
import createDeviceToken from "../../../Requests/createDeviceToken.ts";
import deleteDevice from "../../../Requests/deleteDevice.ts";
import deleteDeviceData from "../../../Requests/deleteDeviceData.ts";
import deleteDeviceToken from "../../../Requests/deleteDeviceToken.ts";
import editDevice from "../../../Requests/editDevice.ts";
import setDeviceParams from "../../../Requests/setDeviceParams.ts";
import { getSocket } from "../../../System/Socket.ts";
import buildZodError from "../../../Validation/buildZodError.ts";
import EditPage from "../../EditPage/EditPage.tsx";
import Icon from "../../Icon/Icon.tsx";
import { EIcon } from "../../Icon/Icon.types";
import Switch from "../../Switch/Switch.tsx";
import TagsTab from "../../Tags/TagsTab.tsx";
import DeviceInputOutput from "../Common/DeviceInputOutput.tsx";
import type { IInspectorData } from "../Common/LiveInspector/LiveInspector.types";
import normalizeConfigParameters from "../Helpers/normalizeConfigParameters.ts";
import { ChunksTab } from "./ChunksTab/ChunksTab.tsx";
import ConfigParametersTab from "./ConfigParametersTab/ConfigParametersTab.tsx";
import DataTab from "./DataTab/DataTab.tsx";
import GeneralInformationTab from "./GeneralInformationTab/GeneralInformationTab.tsx";
import LiveInspectorTab from "./LiveInspectorTab/LiveInspectorTab.tsx";
import MoreTab from "./MoreTab/MoreTab.tsx";

function DeviceEdit() {
  const match = useMatch("/console/devices/:id");
  const id = match?.params?.id;

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
  const { data: encoderModules } = useApiRequest<IPluginClassListItem[]>(
    "/module?type=encoder",
  );
  const { data: apiTokens, mutate: mutateApiTokens } = useApiRequest<
    IDeviceToken[]
  >(`/device/token/${id}`);
  const { data: apiParams, mutate: mutateApiParams } = useApiRequest<
    IDeviceParameter[]
  >(`/device/${id}/params`);
  const initialData = useRef<IDevice>({} as IDevice);
  const intervalInspectorAttach = useRef<any>(null);

  const loading = !encoderModules || !data.id || !tokens || !params;

  const { data: dataAmount, mutate: mutateDataAmount } = useApiRequest<number>(
    `/device/${id}/data_amount`,
  );

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
      await zDevice.omit({ last_retention: true }).parseAsync({
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
    const formatted: Partial<IDevice> & { encoder_stack: string[] } = {
      active: data.active,
      id: data.id,
      name: data.name,
      payload_parser: data.payload_parser,
      tags: normalizeTags(data.tags),
      encoder_stack: data.encoder_stack || [],
    };

    if (!id) {
      return;
    }

    if (data.type === "immutable") {
      (formatted as IDevice).chunk_retention = data.chunk_retention;
    }

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
    if (!id) {
      return;
    }

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
    getSocket().emit("unattach", "device", id);
    getSocket().off("device::inspection");
    clearInterval(intervalInspectorAttach.current);
  }, [id]);

  /**
   * Called when the inspector receives a new message.
   */
  const onInspectorMessage = useCallback(
    (msg: ILiveInspectorMessage | ILiveInspectorMessage[]) => {
      if (Array.isArray(msg)) {
        for (const item of msg) {
          inspectorData.logs[item.connection_id] =
            inspectorData.logs[item.connection_id] || [];
          inspectorData.logs[item.connection_id].push(item);
        }
      } else {
        inspectorData.logs[msg.connection_id] =
          inspectorData.logs[msg.connection_id] || [];
        inspectorData.logs[msg.connection_id].push(msg);
      }
      setInspectorData({ ...inspectorData, logs: { ...inspectorData.logs } });
    },
    [inspectorData],
  );

  /**
   * Called when a field from a tab gets modified.
   * This will apply the change to the data state.
   */
  const onChangeData = useCallback(
    (field: keyof IDevice, value: IDevice[keyof IDevice]) => {
      setData({ ...data, [field]: value });
    },
    [data],
  );

  const deleteMultipleData = useCallback(
    async (ids: string[]) => {
      if (!id) {
        return;
      }

      await deleteDeviceData(id, { ids });
      mutateDataAmount(Math.max(dataAmount - ids.length, 0));
    },
    [mutateDataAmount, dataAmount, id],
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
        onChangeEnabled={(enabled) =>
          setInspectorData({ ...inspectorData, enabled })
        }
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
    return (
      <ConfigParametersTab
        errors={errors}
        params={params}
        onChangeParams={setParams}
      />
    );
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

        <span>Type </span>
        <b>{getDeviceTypeName(data.type)}</b>
        <span> &nbsp;|&nbsp; </span>

        {data.type === "immutable" && (
          <>
            <span>Data retention </span>
            <b>{formatDataRetention(data) || "Forever"}</b>
            <span> &nbsp;|&nbsp; </span>
          </>
        )}

        <span>Data amount&nbsp;</span>
        <b>{dataAmount}</b>
      </>
    );
  };

  const renderDataTab = useCallback(() => {
    return (
      <DataTab
        data={data}
        onDeleteData={deleteMultipleData}
        dataAmount={dataAmount}
        onReloadDataAmount={() => mutateDataAmount(dataAmount, true)}
      />
    );
  }, [data, deleteMultipleData, dataAmount, mutateDataAmount]);

  const renderChunksTab = useCallback(() => {
    return <ChunksTab data={data} errors={errors} onChange={onChangeData} />;
  }, [data, errors, onChangeData]);

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
      JSON.stringify(initialDataNormalized) !==
        JSON.stringify(currentDataNormalized) ||
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
        getSocket().emit("attach", "device", id);
      }, 30000); // 30 seconds

      getSocket().emit("attach", "device", id);
      getSocket().off("device::inspection");
      getSocket().on("device::inspection", onInspectorMessage);
    } else {
      stopInspector();
    }
    return () => stopInspector();
  });

  return (
    <EditPage<IDevice>
      resourceId={id}
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
          label: "Data",
          content: renderDataTab(),
        },
        {
          label: "Chunks",
          content: renderChunksTab(),
          hidden: !data || data.type !== "immutable",
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

function formatDataRetention(data: IDevice) {
  if (data.type === "mutable") {
    return null;
  }

  const retention = data.chunk_retention ?? null;

  if (!data.chunk_period || retention === null) {
    return null;
  }

  return retention < 1 || retention > 1
    ? `${retention} ${data.chunk_period}s`
    : `${retention} ${data.chunk_period}`;
}

export default observer(DeviceEdit);
