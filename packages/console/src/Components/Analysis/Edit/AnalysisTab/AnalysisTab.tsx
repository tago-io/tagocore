import type { IAnalysis, ILog } from "@tago-io/tcore-sdk/types";
import { memo, useCallback, useEffect, useState } from "react";
import downloadFile from "../../../../Helpers/download.ts";
import getDateTimeObject from "../../../../Helpers/getDateTimeObject.ts";
import Button from "../../../Button/Button.tsx";
import { EButton } from "../../../Button/Button.types";
import Console from "../../../Console/Console.tsx";
import FlexRow from "../../../FlexRow/FlexRow.tsx";
import FormGroup from "../../../FormGroup/FormGroup.tsx";
import Icon from "../../../Icon/Icon.tsx";
import { EIcon } from "../../../Icon/Icon.types";
import Input from "../../../Input/Input.tsx";
import ProgramFieldset from "../../../ProgramFieldset/ProgramFieldset.tsx";
import Tooltip from "../../../Tooltip/Tooltip.tsx";
import AutomateTip from "../../Common/AutomateTip/AutomateTip.tsx";
import ConsoleOptions from "../../Common/ConsoleOptions/ConsoleOptions.tsx";
import * as Style from "./AnalysisTab.style";

/**
 * Props.
 */
interface IAnalysisTabProps {
  /**
   * Analysis' form data
   */
  data: IAnalysis;
  /**
   * Called when a field is changed.
   */
  onChange: (field: keyof IAnalysis, value: IAnalysis[keyof IAnalysis]) => void;
  /**
   * Output logs for the analysis.
   */
  logs: ILog[];
  /**
   * Called when the logs are cleared.
   */
  onClearLogs: () => void;
  /**
   * Called when the logs are deleted.
   */
  onDeleteLogs: () => void;
}

/**
 * The device edit page.
 */
function AnalysisTab(props: IAnalysisTabProps) {
  const { data, logs, onClearLogs, onDeleteLogs, onChange } = props;
  const [options, setOptions] = useState(false);
  const [logsTrimmed, setLogsTrimmed] = useState(() => logs || []);

  /**
   * Downloads the logs in a `txt` file.
   */
  const downloadLogs = useCallback(() => {
    const mapped = logsTrimmed.map((item) => {
      const date = getDateTimeObject(item.timestamp)?.toFormat(
        "yyyy-LL-dd HH:mm:ss.SSS",
      );
      const message = String(item.message).trim();
      return `[${date}]: ${message}`;
    });
    downloadFile(mapped.join("\n"), "txt", "console");
  }, [logsTrimmed]);

  /**
   * Renders the console header.
   */
  const renderConsoleHeader = () => {
    return (
      <Style.ConsoleHeader>
        <div>
          <h2>Console</h2>
        </div>

        <FlexRow>
          <Tooltip text="Download logs as a text file">
            <Button type={EButton.icon} onClick={downloadLogs}>
              <Icon size="15px" icon={EIcon.download} />
            </Button>
          </Tooltip>

          <Tooltip text="Clear console">
            <Button type={EButton.icon} onClick={onClearLogs}>
              <Icon size="15px" icon={EIcon.ban} />
            </Button>
          </Tooltip>

          <Button
            className="ban-append"
            onClick={(e) => {
              setOptions(!options);
              e.stopPropagation();
            }}
          >
            <Icon size="15px" icon={EIcon["caret-down"]} />
          </Button>

          <ConsoleOptions
            visible={options}
            onClose={() => setOptions(false)}
            onDelete={onDeleteLogs}
          />
        </FlexRow>
      </Style.ConsoleHeader>
    );
  };

  useEffect(() => {
    setLogsTrimmed(logs?.slice(0, 100) || []);
  }, [logs]);

  return (
    <Style.Container>
      <div className="data">
        <FormGroup icon={EIcon.code} label="Name">
          <Input
            onChange={(e) => onChange("name", e.target.value)}
            value={data.name}
            placeholder="Enter the analysis' name"
          />
        </FormGroup>

        <FormGroup>
          <AutomateTip />
        </FormGroup>

        <ProgramFieldset
          binaryPath={data.binary_path || ""}
          filePath={data.file_path || ""}
          onChangeBinaryPath={(e) => onChange("binary_path", e)}
          onChangeFilePath={(e) => onChange("file_path", e)}
          title="Code"
        />
      </div>

      <div className="console">
        {renderConsoleHeader()}
        <Console
          showDate
          data={logsTrimmed}
          emptyMessage="No logs yet."
          emptyMessageIcon={EIcon.code}
        />
      </div>
    </Style.Container>
  );
}

export default memo(AnalysisTab);
