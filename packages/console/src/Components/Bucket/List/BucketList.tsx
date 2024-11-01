import type { IDevice } from "@tago-io/tcore-sdk/types";
import { useTheme } from "styled-components";
import getDeviceTypeName from "../../../Helpers/getDeviceTypeName.ts";
import getDeviceList from "../../../Requests/getDeviceList.ts";
import Capitalize from "../../Capitalize/Capitalize.tsx";
import { EIcon } from "../../Icon/Icon.types";
import ListPage from "../../ListPage/ListPage.tsx";
import RelativeDate from "../../RelativeDate/RelativeDate.tsx";
import ButtonDataAmount from "./ButtonDataAmount/ButtonDataAmount.tsx";

/**
 * The bucket list page.
 */
function BucketList() {
  const theme = useTheme();

  /**
   * Renders the data retention field.
   */
  const renderDataRetention = (data: IDevice) => {
    let value = "";
    if (data.type === "mutable") {
      value = "n/a";
    } else if (data.type === "immutable") {
      if (data.chunk_period) {
        value = `${data.chunk_retention} ${data.chunk_period}`;
      } else {
        value = "forever";
      }
    } else {
      value = "forever";
    }

    return <Capitalize>{value}</Capitalize>;
  };

  /**
   * Renders the storage type.
   */
  function renderStorageType(data: IDevice) {
    const { type } = data;
    const name = getDeviceTypeName(type);
    const color =
      type === "immutable"
        ? theme.dataStorageImmutable
        : theme.dataStorageMutable;
    return <span style={{ color }}>{name}</span>;
  }

  return (
    <ListPage<IDevice>
      color={theme.bucket}
      description="Buckets are where data from your devices is stored and accessed."
      documentTitle="Buckets"
      icon={EIcon.bucket}
      innerNavTitle="Buckets"
      onGetData={getDeviceList}
      path="buckets"
      summaryKey="device"
      columns={[
        {
          id: "name",
          label: "Name",
          onRender: (item) => item.name,
          type: "text",
        },
        {
          flex: "none",
          id: "data_amount",
          label: "Data amount",
          onRender: (item) => <ButtonDataAmount key={item.id} device={item} />,
          width: 180,
        },
        {
          id: "data_retention",
          label: "Retain data for",
          onRender: (item) => renderDataRetention(item),
        },
        {
          id: "type",
          label: "Type",
          onRender: (item) => renderStorageType(item),
          filterDisabled: true,
          flex: "none",
          width: 250,
        },
        {
          id: "created_at",
          label: "Created at",
          onRender: (item) => <RelativeDate value={item.created_at} />,
          type: "date",
        },
      ]}
    />
  );
}

export default BucketList;
