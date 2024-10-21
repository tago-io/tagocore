import type { IDevice, IDeviceChunkPeriod } from "@tago-io/tcore-sdk/types";
import { useRef } from "react";
import { Col, EIcon, FormGroup, Icon, Input, Row } from "../../../../index.ts";
import AlertInfo from "../../../AlertInfo/AlertInfo.tsx";
import { EAlertInfo } from "../../../AlertInfo/AlertInfo.types";
import ErrorMessage from "../../../ErrorMessage/ErrorMessage.tsx";
import Select from "../../../Select/Select.tsx";
import * as Style from "./DataRetention.style";

const MAX_INPUT_VALUES: any = {
  quarter: 36,
  week: 26,
  month: 36,
  day: 31,
};

interface IDataRetentionProps {
  /**
   * Type of alert info to show at the bottom of the component.
   */
  type?: "create" | "edit";
  /**
   * Device data.
   */
  data: IDevice;
  /**
   * Indicates if the 'period' field should be disabled.
   */
  disablePeriod?: boolean;
  /**
   * Indicates if the fields have errors.
   */
  error?: boolean;
  /**
   * Called when a field is changed.
   */
  onChange: (field: keyof IDevice, value: IDevice[keyof IDevice]) => void;
}

/**
 * Controls the data retention property of a device.
 * This component shows some inputs to define the retention of the device and a visual
 * representation below the inputs.
 */
function DataRetention(props: IDataRetentionProps) {
  const { data, error, disablePeriod, onChange } = props;
  const { chunk_retention } = data;
  const chunkPeriod = data.chunk_period as IDeviceChunkPeriod;
  const ref = useRef<HTMLInputElement>(null);

  /**
   * Renders the alert when editing the device.
   */
  const renderAlertEdit = () => {
    const color = "rgba(0, 0, 0, 0.6)";
    const max = MAX_INPUT_VALUES[chunkPeriod];

    return (
      <>
        <Icon color={color} icon={EIcon["info-circle"]} />
        &nbsp;
        <span>
          This selection limits the storage for this device to{" "}
          <b>1 Million data registers per {chunkPeriod}</b> (you cannot change this <b>period</b>).
          But, you can always edit the retention from 0 to {max} {chunkPeriod}s.
          <br />
          <br />
          The retention starts considering the current period - if you were to select &apos;0&apos;
          months it would delete all data when a new month starts.&nbsp;
        </span>
      </>
    );
  };

  /**
   * Renders the alert when creating the device.
   */
  const renderAlertCreation = () => {
    const color = "rgba(0, 0, 0, 0.6)";
    const max = MAX_INPUT_VALUES[chunkPeriod];

    return (
      <>
        <Icon color={color} icon={EIcon["info-circle"]} />
        &nbsp;
        <span>
          This selection limits the storage for this device to{" "}
          <b>1 Million data registers per {chunkPeriod}</b> (you cannot change this <b>period</b>).
          But, you can always edit the retention from 0 to {max} {chunkPeriod}s.
          <br />
          <br />
          The retention starts considering the current period - if you select &apos;0&apos; months
          it will delete all data when a new month starts.&nbsp;
        </span>
      </>
    );
  };

  return (
    <Style.Container disabled={data.type !== "immutable"}>
      <legend>Data Retention</legend>
      <FormGroup>
        <Row>
          <Col size="6">
            <FormGroup
              label="Period"
              icon={EIcon.clock}
              tooltip="Chunk division to retain data"
              style={{ marginBottom: 0 }}
            >
              <Select
                onChange={(e) => {
                  if (
                    MAX_INPUT_VALUES[e.target.value] &&
                    Number(data.chunk_retention) > MAX_INPUT_VALUES[e.target.value]
                  ) {
                    data.chunk_retention = MAX_INPUT_VALUES[e.target.value];
                  }

                  onChange("chunk_period", e.target.value);
                  setTimeout(() => ref.current?.focus(), 50);
                }}
                value={chunkPeriod}
                disabled={disablePeriod}
                error={error}
                options={[
                  { value: "", label: "Select a period", disabled: true },
                  { value: "day", label: "Daily" },
                  { value: "week", label: "Weekly" },
                  { value: "month", label: "Monthly" },
                  { value: "quarter", label: "Quarterly" },
                ]}
              />
            </FormGroup>
          </Col>

          <Col size="6">
            <FormGroup
              label="Retention"
              icon={EIcon.clock}
              tooltip="Used to define how many chunks to retain data for"
              style={{ marginBottom: 0 }}
            >
              <Input
                disabled={!chunkPeriod}
                error={error}
                ref={ref}
                max={MAX_INPUT_VALUES[chunkPeriod] || 30}
                min="0"
                onBlur={() => {
                  if (
                    String(chunk_retention).includes(".") ||
                    String(chunk_retention).includes(",")
                  ) {
                    onChange("chunk_retention", "");
                  }
                }}
                onKeyDown={(e) => {
                  if (String(e.key).toLowerCase() === "e") {
                    // html inputs allow the letter E because it stands for exponential
                    e.preventDefault();
                  }
                }}
                onChange={(e) => {
                  if (e.target.value.includes(".") || e.target.value.includes(",")) {
                    // discard
                  } else if (Number(e.target.value) > MAX_INPUT_VALUES[chunkPeriod]) {
                    onChange("chunk_retention", String(MAX_INPUT_VALUES[chunkPeriod]));
                  } else {
                    onChange("chunk_retention", e.target.value);
                  }
                }}
                placeholder={
                  chunkPeriod ? `0-${MAX_INPUT_VALUES[chunkPeriod] || 30} ${chunkPeriod}s` : ""
                }
                type="number"
                value={chunk_retention ?? ""}
                style={{ textAlign: "center" }}
              />
            </FormGroup>
          </Col>

          <Col size="12">
            {error && <ErrorMessage>You must select a Period and Retention</ErrorMessage>}
          </Col>
        </Row>
      </FormGroup>

      {data.type !== "immutable" ? (
        <FormGroup>
          <AlertInfo type={EAlertInfo.info}>
            <Icon icon={EIcon["info-circle"]} />
            <span>
              &nbsp; Data Retention is available only for the Optimized Device Data (Immutable).
            </span>
          </AlertInfo>
        </FormGroup>
      ) : chunkPeriod && props.type ? (
        <FormGroup>
          <AlertInfo type={EAlertInfo.info}>
            {props.type === "create"
              ? renderAlertCreation()
              : props.type === "edit"
              ? renderAlertEdit()
              : null}
          </AlertInfo>
        </FormGroup>
      ) : null}
    </Style.Container>
  );
}

export default DataRetention;
