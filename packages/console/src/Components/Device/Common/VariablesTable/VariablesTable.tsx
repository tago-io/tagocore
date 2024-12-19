import type { IDevice, IDeviceData } from "@tago-io/tcore-sdk/types";
import { useCallback, useEffect, useState } from "react";
import copyToClipboard from "../../../../Helpers/copyToClipboard.ts";
import getDateTimeObject from "../../../../Helpers/getDateTimeObject.ts";
import { getLocalStorageAsJSON } from "../../../../Helpers/localStorage.ts";
import getDeviceData from "../../../../Requests/getDeviceData.ts";
import { Icon } from "../../../../index.ts";
import Checkbox from "../../../Checkbox/Checkbox.tsx";
import CopyButton from "../../../CopyButton/CopyButton.tsx";
import { EIcon } from "../../../Icon/Icon.types";
import ModalListConfiguration from "../../../ModalListConfiguration/ModalListConfiguration.tsx";
import PaginatedTable from "../../../PaginatedTable/PaginatedTable.tsx";
import type { IFilter } from "../../../PaginatedTable/PaginatedTable.types";
import RelativeDate from "../../../RelativeDate/RelativeDate.tsx";
import TooltipText from "../../../TooltipText/TooltipText.tsx";
import { ModalEditGroup } from "../ModalEditGroup/ModalEditGroup.tsx";
import { ModalEditLocation } from "../ModalEditLocation/ModalEditLocation.tsx";
import { ModalEditMetadata } from "../ModalEditMetadata/ModalEditMetadata.tsx";
import { ModalEditValue } from "../ModalEditValue/ModalEditValue.tsx";
import * as Style from "./VariablesTable.style";

interface VariablesTableProps {
  data: IDevice;
  dataAmount: number;
  refetchID?: number;
  onChangeSelected: (selected: IDeviceData[]) => void;
  onReloadTable: () => void;
  onReloadDataAmount: () => void;
}

export function VariablesTable(props: VariablesTableProps) {
  const {
    dataAmount,
    onReloadDataAmount,
    onReloadTable,
    onChangeSelected,
    refetchID,
    data,
  } = props;

  const [dateFormat, setDateFormat] = useState(() => {
    const dd = getLocalStorageAsJSON(`${data.id}::data::settings`);
    return dd?.dateFormat || "";
  });
  const [enabledColumns, setEnabledColumns] = useState<any>(() => {
    const dd = getLocalStorageAsJSON(`${data.id}::data::settings`);
    return dd?.enabledColumns || {};
  });

  /**
   * End date for pinning the requests.
   *
   * Handles the user paginating through the table while new data is arriving in the device,
   * making the requests never return data more recent than the pinned date until a page reload
   * or the `refreshData` function is used.
   */
  const [currentEndDate, setCurrentEndDate] = useState<string>(() =>
    new Date().toISOString(),
  );

  const [edit, setEdit] = useState<any>(null);
  const [modalListConfiguration, setModalListConfiguration] = useState(false);
  const [amountOfRecords, setAmountOfRecords] = useState(0);
  const [selectedVariables, setSelectedVariables] = useState<any>({});
  const [hasLocation, setHasLocation] = useState(false);
  const [hasMetadata, setHasMetadata] = useState(false);
  const [page, setPage] = useState(1);

  const onGetData = async (_page: number, amount: number, filter: IFilter) => {
    const result = await getDeviceData(
      data.id,
      page - 1,
      amount,
      filter,
      currentEndDate,
    );
    setAmountOfRecords(result.length);
    setHasLocation(result.some((x) => x.location));
    setHasMetadata(result.some((x) => x.metadata));
    return result;
  };

  const copyJSON = (item: IDeviceData) => {
    copyToClipboard(JSON.stringify(item, null, 2));
  };

  const refresh = useCallback(() => {
    onReloadDataAmount();
    setCurrentEndDate(new Date().toISOString());
    if (page === 1) {
      onReloadTable();
    } else {
      setPage(1);
    }
  }, [onReloadDataAmount, onReloadTable, page]);

  const renderMetadata = (item: IDeviceData) => {
    const keys = Object.keys(item.metadata || {}).length;
    const tooltip = <pre>{JSON.stringify(item.metadata, null, 2)}</pre>;

    return (
      <div style={{ textAlign: "center" }}>
        <TooltipText icon={null} tooltip={item.metadata ? tooltip : ""}>
          {`${keys} Item${keys === 1 ? "" : "s"}`}
        </TooltipText>
        {renderPencil(item, "metadata")}
      </div>
    );
  };

  const renderLocation = (item: IDeviceData) => {
    if (!item.location || !item.location.coordinates) {
      return (
        <Style.LocationContainer>
          {renderPencil(item, "location")}
        </Style.LocationContainer>
      );
    }

    const lat = item.location.coordinates[1];
    const lng = item.location.coordinates[0];
    const link = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}&zoom=20`;
    const label = latLngToDms(lat, lng);

    return (
      <Style.LocationContainer>
        <TooltipText tooltip="Click to open location on Google Maps">
          <a href={link} target="_blank" rel="noreferrer">
            {label}
          </a>
        </TooltipText>
        {renderPencil(item, "location")}
      </Style.LocationContainer>
    );
  };

  const renderID = (item: IDeviceData) => {
    return (
      <Style.IDContainer onClick={() => copyToClipboard(item.id)}>
        <TooltipText tooltip="Click to copy the full ID">
          {item.id.substring(item.id.length - 5)}
        </TooltipText>
      </Style.IDContainer>
    );
  };

  const renderCheck = (item: IDeviceData) => {
    return (
      <Style.Checkbox>
        <Checkbox
          checked={selectedVariables[item.id] || false}
          onChange={(e) => {
            if (e.target.checked) {
              selectedVariables[item.id] = item;
            } else {
              delete selectedVariables[item.id];
            }
            setSelectedVariables(selectedVariables);
            onChangeSelected(
              Object.keys(selectedVariables).map((x) => selectedVariables[x]),
            );
          }}
        />
      </Style.Checkbox>
    );
  };

  const renderPencil = (item: IDeviceData, type: string) => {
    if (data.type === "immutable") {
      return null;
    }
    return (
      <Style.Pencil
        className="table-hover-edit pencil"
        onClick={() => setEdit({ item, type })}
      >
        <Icon icon={EIcon["pencil-alt"]} size="11px" />
      </Style.Pencil>
    );
  };

  const renderValue = (item: IDeviceData) => {
    const type = typeof item.value;
    return (
      <Style.ValueContainer>
        <div className="value">
          {type === "boolean" ? String(item.value) : item.value}
        </div>
        <div className="type">({type})</div>
        {renderPencil(item, "value")}
      </Style.ValueContainer>
    );
  };

  const renderGroup = (item: IDeviceData) => {
    return (
      <Style.ValueContainer>
        <div className="value">{item.group}</div>
        {renderPencil(item, "group")}
      </Style.ValueContainer>
    );
  };

  const renderCopyButton = (item: IDeviceData) => {
    return (
      <Style.CopyButtonContainer>
        <CopyButton
          tooltip="Copy JSON of the data item"
          iconSize="12px"
          onClick={() => copyJSON(item)}
        />
      </Style.CopyButtonContainer>
    );
  };

  const renderTime = (item: IDeviceData) => {
    if (!dateFormat || dateFormat === "relative") {
      return <RelativeDate value={item.time} />;
    }
    return getDateTimeObject(item.time)?.toFormat(dateFormat);
  };

  useEffect(() => {
    if (!dataAmount) {
      // this will make the paginated table refresh the data by calling `onGetData`
      setAmountOfRecords(0);
    }
  }, [dataAmount]);

  const showLocationColumn =
    enabledColumns.location === true ? true : hasLocation;
  const showMetadataColumn =
    enabledColumns.metadata === true ? true : hasMetadata;

  return (
    <Style.Container>
      {modalListConfiguration && (
        <ModalListConfiguration
          onClose={() => {
            const dd = getLocalStorageAsJSON(`${data.id}::data::settings`);
            setEnabledColumns(dd?.enabledColumns || {});
            setDateFormat(dd?.dateFormat || "");
            setModalListConfiguration(false);
          }}
          deviceID={data.id}
        />
      )}

      <PaginatedTable<IDeviceData>
        amountOfRecords={amountOfRecords}
        refetchID={refetchID}
        columns={[
          data.type === "immutable"
            ? null
            : {
                label: "",
                onRender: renderCheck,
                filterVisible: false,
                type: "icon",
                flex: "none",
                width: 30,
                id: "check",
              },
          enabledColumns.id === false
            ? null
            : {
                flex: "none",
                id: "id",
                label: "ID",
                onRender: renderID,
                tooltip: "ID of the data item",
                width: 80,
                filterDisabled: data.type === "immutable",
              },
          enabledColumns.variable === false
            ? null
            : {
                label: "Variable",
                onRender: (item) => item.variable,
                tooltip: "Name of the variable",
                id: "variable",
              },
          enabledColumns.value === false
            ? null
            : {
                label: "Value",
                onRender: renderValue,
                tooltip: "Value of the data item",
                id: "value",
              },
          enabledColumns.group === false
            ? null
            : {
                label: "Group",
                onRender: renderGroup,
                tooltip: "Group of this item",
                id: "group",
              },
          showLocationColumn
            ? {
                label: "Location",
                onRender: renderLocation,
                tooltip: "Location of the data item",
                id: "location",
                filterDisabled: true,
              }
            : null,
          showMetadataColumn
            ? {
                label: "Metadata",
                onRender: renderMetadata,
                tooltip: "Metadata of the data item",
                width: 90,
                flex: "none",
                id: "metadata",
                filterDisabled: true,
              }
            : null,
          enabledColumns.time === false
            ? null
            : {
                label: "Time",
                onRender: renderTime,
                tooltip: "Time of the data item",
                width: 190,
                flex: "none",
                id: "time",
                type: "date",
              },
          {
            label: "",
            onRender: renderCopyButton,
            filterVisible: false,
            type: "icon",
            flex: "none",
            width: 60,
            id: "copy",
          },
        ]}
        emptyMessage="No data found."
        emptyMessageIcon={EIcon.cube}
        onChangePage={setPage}
        onGetData={onGetData}
        infinitePages
        page={page}
        showConfigButton
        showRefreshButton
        onConfigButtonClick={() => setModalListConfiguration(true)}
        onRefreshButtonClick={refresh}
      />

      {edit?.type === "value" ? (
        <ModalEditValue
          data={edit.item}
          device={data}
          onClose={() => setEdit(null)}
        />
      ) : edit?.type === "group" ? (
        <ModalEditGroup
          data={edit.item}
          device={data}
          onClose={() => setEdit(null)}
        />
      ) : edit?.type === "metadata" ? (
        <ModalEditMetadata
          data={edit.item}
          device={data}
          onClose={() => setEdit(null)}
        />
      ) : edit?.type === "location" ? (
        <ModalEditLocation
          onClose={() => setEdit(null)}
          device={data}
          data={edit.item}
        />
      ) : null}
    </Style.Container>
  );
}

/**
 * Converts lat/lng into into degrees minutes seconds.
 *
 * @example
 * { "lat": 35.770723, "lng": -78.677328 } becomes 35°46'14.6"N 78°40'38.4"W.
 */
function latLngToDms(lat: number, lng: number) {
  const separate = (data: number) => {
    const split = String(data).split(".");
    const a1 = Number(split[0]);
    const a2 = Number(`0.${split[1] || 0}`);
    return [a1, a2];
  };

  const [latT, latD] = separate(lat); // latitude separated into thousand and decimal
  const [latM, latMD] = separate(latD * 60); // converts decimals of lat into minutes and decimal minutes
  const latS = latMD * 60; // converts the decimals of lat minutes into seconds and decimal seconds

  const [lngT, lngD] = separate(lng); // longitude separated into thousand and decimal
  const [lngM, lngMD] = separate(lngD * 60); // converts decimals of lng into minutes and decimal minutes
  const lngS = lngMD * 60; // converts the decimals of lng minutes into seconds and decimal seconds

  const latDms = `${Math.abs(latT)}°${latM}'${Math.round(latS * 10) / 10}"${lat < 0 ? "S" : "N"}`;
  const lngDms = `${Math.abs(lngT)}°${lngM}'${Math.round(lngS * 10) / 10}"${lng < 0 ? "W" : "E"}`;
  const full = `${latDms} ${lngDms}`;

  return full;
}
