import type { ISummary } from "@tago-io/tcore-sdk/types";
import type { AxiosError } from "axios";
import { observer } from "mobx-react";
import { memo } from "react";
import { EmptyMessage } from "../../../index.ts";
import store from "../../../System/Store.ts";
import Icon from "../../Icon/Icon.tsx";
import { EIcon } from "../../Icon/Icon.types";
import * as Style from "./Summary.style";

/**
 * Props.
 */
interface ISummaryProps {
  /**
   * Data to be rendered.
   */
  data?: ISummary | null;
  /**
   * Error while requesting.
   */
  error?: AxiosError;
}

/**
 * Summary component for the home page.
 */
function Summary(props: ISummaryProps) {
  const { data, error } = props;
  const loading = !data;

  /**
   * Renders a single item in the list.
   */
  const renderItem = (icon: EIcon, name: string, value?: number | string) => {
    let realValue = value;
    if (loading || value === undefined || value === null) {
      realValue = "-";
    }

    return (
      <Style.Item>
        <div className="left">
          <Icon size="12px" icon={icon} />
          <span>{name}</span>
        </div>
        <div className="value">{realValue}</div>
      </Style.Item>
    );
  };

  const errorMessage = error?.response?.data?.message || error?.toString?.();

  return (
    <Style.Container $loading={loading && !errorMessage}>
      {error ? (
        <EmptyMessage icon={EIcon["exclamation-triangle"]} message={errorMessage} />
      ) : (
        <>
          <div className="group">
            {renderItem(EIcon.device, "Devices", data?.device)}
            {renderItem(EIcon.bucket, "Buckets", data?.device)}
          </div>
          <div className="group">
            {renderItem(EIcon.code, "Analysis", data?.analysis)}
            {renderItem(EIcon.bolt, "Actions", data?.action)}
          </div>
          <div className="group">
            {renderItem(EIcon.connector, "Connectors", "-")}
            {renderItem(EIcon.tcore, "Version", store.version)}
          </div>
        </>
      )}
    </Style.Container>
  );
}

export default memo(observer(Summary));
