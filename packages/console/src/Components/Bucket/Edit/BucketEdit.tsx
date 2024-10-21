import { type IDevice, zDeviceChunkRetention } from "@tago-io/tcore-sdk/types";
import axios from "axios";
import cloneDeep from "lodash.clonedeep";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouteMatch } from "react-router";
import { useTheme } from "styled-components";
import { z } from "zod";
import { formatDataAmount } from "../../../Helpers/formatDataAmount.ts";
import getDeviceTypeName from "../../../Helpers/getDeviceTypeName.ts";
import useApiRequest from "../../../Helpers/useApiRequest.ts";
import deleteDeviceData from "../../../Requests/deleteDeviceData.ts";
import editDevice from "../../../Requests/editDevice.ts";
import store from "../../../System/Store.ts";
import buildZodError from "../../../Validation/buildZodError.ts";
import Capitalize from "../../Capitalize/Capitalize.tsx";
import EditPage from "../../EditPage/EditPage.tsx";
import { EIcon } from "../../Icon/Icon.types";
import GeneralInformationTab from "./GeneralInformationTab/GeneralInformationTab.tsx";
import MoreTab from "./MoreTab/MoreTab.tsx";
import VariablesTab from "./VariablesTab/VariablesTab.tsx";

/**
 * The bucket's edit page.
 */
function BucketEdit() {
  const match = useRouteMatch<{ id: string }>();
  const { id } = match.params;

  const theme = useTheme();
  const [data, setData] = useState<IDevice>({} as IDevice);
  const [tabIndex, setTabIndex] = useState(0);
  const [errors, setErrors] = useState<any>({});
  const { data: dataAmount, mutate: mutateDataAmount } = useApiRequest<number>(
    `/device/${id}/data_amount`
  );
  const initialData = useRef<IDevice>({} as IDevice);

  const loading = !data.id || dataAmount === undefined;

  /**
   * Called when the record was fetched by the edit page.
   * We use this to set the data state to manipulate the object.
   */
  const onFetch = useCallback((bucket: IDevice) => {
    setData(bucket);
    initialData.current = cloneDeep(bucket);
  }, []);

  /**
   * Validates the form data to make sure the object is not faulty.
   * This should return a boolean to indicate if the data is correct or not.
   */
  const validate = useCallback(async () => {
    try {
      await z.object({ chunk_retention: zDeviceChunkRetention }).parseAsync(data);
      setErrors({});
      return true;
    } catch (ex: any) {
      const err = buildZodError(ex.issues);
      setErrors(err);
      return false;
    }
  }, [data]);

  /**
   * Saves the bucket.
   */
  const save = useCallback(async () => {
    await editDevice(id, { chunk_retention: data.chunk_retention });
    initialData.current = cloneDeep(data);
  }, [id, data]);

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
   * Empties the bucket.
   */
  const emptyBucket = useCallback(async () => {
    await axios.post(`/device/${id}/empty`, {}, { headers: { token: store.token } });
    window.location.reload();
    await new Promise(() => {
      /* to get stuck until reload */
    });
  }, [id]);

  /**
   * Deletes certain data points.
   */
  const deleteData = useCallback(
    async (ids: string[]) => {
      await deleteDeviceData(id, { ids });
      mutateDataAmount(Math.max(dataAmount - ids.length, 0));
    },
    [mutateDataAmount, dataAmount, id]
  );

  /**
   * Renders the `Variables` tab's content.
   */
  const renderVariables = () => {
    return (
      <VariablesTab
        onReloadDataAmount={() => mutateDataAmount(dataAmount, true)}
        data={data}
        dataAmount={dataAmount}
        onDeleteData={deleteData}
      />
    );
  };

  /**
   * Renders the `General Information` tab's content.
   */
  const renderGeneralInformationTab = () => {
    return <GeneralInformationTab data={data} errors={errors} onChange={onChangeData} />;
  };

  /**
   * Renders the page's nav description.
   */
  const renderDescription = () => {
    return (
      <>
        <span>Data retention </span>
        <b>
          <Capitalize>{data.data_retention || "forever"}</Capitalize>
        </b>
        <span> &nbsp;|&nbsp; </span>
        <span>Amount of data records </span>
        <b>{formatDataAmount(dataAmount)}</b>

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
    return <MoreTab onEmptyBucket={emptyBucket} dataAmount={dataAmount} data={data} />;
  }, [emptyBucket, data, dataAmount]);

  /**
   * Should return if the initial data is different from the current data.
   */
  const checkIfDataChanged = useCallback(() => {
    return JSON.stringify(initialData.current) !== JSON.stringify(data);
  }, [data]);

  /**
   */
  useEffect(() => {
    if (tabIndex === 1) {
      mutateDataAmount(dataAmount, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mutateDataAmount, tabIndex]);

  return (
    <EditPage<IDevice>
      color={theme.bucket}
      description={renderDescription()}
      documentTitle="Bucket"
      icon={EIcon.bucket}
      innerNavTitle={data.name || ""}
      loading={loading}
      onChangeTabIndex={setTabIndex}
      onCheckIfDataChanged={checkIfDataChanged}
      onFetch={onFetch}
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
          label: "Variables",
          content: renderVariables(),
        },
        {
          label: "More",
          content: renderMoreTab(),
        },
      ]}
    />
  );
}

export default BucketEdit;
