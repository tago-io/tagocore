import { memo, useCallback, useEffect, useState } from "react";
import { useTheme } from "styled-components";
import type { ILiveInspectorMessage } from "@tago-io/tcore-sdk/types";
import downloadFile from "../../../../Helpers/download.ts";
import getDateTimeObject from "../../../../Helpers/getDateTimeObject.ts";
import Button from "../../../Button/Button.tsx";
import { EButton } from "../../../Button/Button.types";
import EmptyMessage from "../../../EmptyMessage/EmptyMessage.tsx";
import Icon from "../../../Icon/Icon.tsx";
import { EIcon } from "../../../Icon/Icon.types";
import Input from "../../../Input/Input.tsx";
import InputRadio from "../../../InputRadio/InputRadio.tsx";
import Tooltip from "../../../Tooltip/Tooltip.tsx";
import * as Style from "./LiveInspector.style";
import LiveInspectorRow from "./LiveInspectorRow.tsx";

/**
 * Props.
 */
interface ILiveInspectorProps {
  /**
   * Indicates if the live inspector is enabled or not.
   */
  enabled: boolean;
  /**
   * Limit amount of records.
   */
  limit: number;
  /**
   * Logs of the inspector.
   */
  logs: { [key: string]: ILiveInspectorMessage[] };
  /**
   * Called when the limit changes.
   */
  onChangeLimit: (newLimit: number) => void;
  /**
   * Called when the enabled status changes.
   */
  onChangeEnabled: (enabled: boolean) => void;
  /**
   * Called when the console is cleared.
   */
  onClear: () => void;
}

/**
 */
function LiveInspector(props: ILiveInspectorProps) {
  const [filter, setFilter] = useState("");
  const [logsFiltered, setLogsFiltered] = useState<ILiveInspectorMessage[][]>([]);
  const { enabled, limit, logs, onClear, onChangeEnabled, onChangeLimit } = props;
  const theme = useTheme();

  /**
   * Downloads the logs in a `txt` file.
   */
  const downloadLogs = useCallback(() => {
    const mapped = [];
    for (const item of logsFiltered) {
      for (const subItem of item) {
        const format = "yyyy-LL-dd HH:mm:ss.SSS";
        const date = getDateTimeObject(subItem.timestamp)?.toFormat(format);
        const content = subItem.content;
        mapped.push(`[${date}]: ${subItem.title} ${content}`);
      }
      mapped.push("------");
    }

    downloadFile(mapped.join("\n"), "txt", "console");
  }, [logsFiltered]);

  /**
   */
  const filterLogs = useCallback(() => {
    const result: any = {};

    Object.keys(logs).forEach((key: string) => {
      result[key] = logs[key].filter((item: any) => {
        const filterLowerCase = filter.toLowerCase();
        const content = (String(item.content) || "").toLowerCase();
        const timestamp = (String(item.timestamp) || "").toLowerCase();
        const title = (String(item.title) || "").toLowerCase();
        return (
          !filter ||
          content.includes(filterLowerCase) ||
          timestamp.includes(filterLowerCase) ||
          title.includes(filterLowerCase)
        );
      });

      if (!result[key].length) {
        delete result[key];
      }
    });

    const array = Object.keys(result).map((key) => result[key]);

    const sorted = array
      .sort((a, b) => {
        return new Date(b[0].timestamp).getTime() - new Date(a[0].timestamp).getTime();
      })
      .slice(0, limit);

    return sorted;
  }, [filter, limit, logs]);

  /**
   * Renders the header of the live inspector.
   */
  const renderHeader = () => {
    return (
      <Style.Header>
        <Input
          autoFocus
          placeholder="Search"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />

        <InputRadio
          value={String(limit)}
          onChange={(e) => onChangeLimit(Number(e))}
          options={[
            { label: "25", value: "25" },
            { label: "50", value: "50" },
            { label: "100", value: "100" },
            { label: "500", value: "500" },
          ]}
        />

        <Tooltip text="Download as a text file">
          <Button type={EButton.icon} onClick={downloadLogs}>
            <Icon size="15px" icon={EIcon.download} />
          </Button>
        </Tooltip>

        <Tooltip text="Clear data">
          <Button type={EButton.icon} onClick={onClear}>
            <Icon size="15px" icon={EIcon.ban} />
          </Button>
        </Tooltip>

        <Button
          type={EButton.icon}
          color={enabled ? theme.buttonWarning : "green"}
          onClick={() => onChangeEnabled(!enabled)}
        >
          <Icon size="12px" icon={enabled ? EIcon.pause : EIcon.play} />
        </Button>
      </Style.Header>
    );
  };

  /**
   * Renders the empty message in the middle of the component.
   * This should only be called when there is no data (logs) in the component.
   */
  const renderEmptyMessage = () => {
    return (
      <EmptyMessage
        icon={EIcon.search}
        message={
          enabled ? (
            <>
              <div>Nothing yet.</div>
              <div>Waiting for data to arrive...</div>
            </>
          ) : (
            <>
              <div>Nothing yet.</div>
              <div>
                Press <Icon icon={EIcon.play} size="13px" color="green" /> to start the inspector.
              </div>
            </>
          )
        }
      />
    );
  };

  /**
   * Renders all the lines of the log.
   */
  const renderLogs = () => {
    return logsFiltered.map((x, i) => (
      <Style.Item key={i}>
        {x.map((item: ILiveInspectorMessage, index: number) => {
          const key = `${item.connection_id}${index}`;
          return (
            <LiveInspectorRow
              timestamp={item.timestamp}
              title={item.title}
              content={item.content}
              key={key}
              id={key}
            />
          );
        })}
      </Style.Item>
    ));
  };

  /**
   * Renders the body of the live inspector.
   */
  const renderBody = () => {
    const hasLogs = Object.keys(logsFiltered).length > 0;
    return (
      <Style.Body isEmpty={!hasLogs}>{hasLogs ? renderLogs() : renderEmptyMessage()}</Style.Body>
    );
  };

  /**
   * Resets the filtered array when a new data arrives on when one of the filter changes.
   */
  useEffect(() => {
    const filtered = filterLogs();
    setLogsFiltered(filtered);
  }, [filterLogs, logs]);

  return (
    <Style.Container>
      {renderHeader()}
      {renderBody()}
    </Style.Container>
  );
}

export default memo(LiveInspector);
