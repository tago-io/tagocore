import { memo, useState } from "react";
import getDateTimeObject from "../../../../Helpers/getDateTimeObject.ts";
import Icon from "../../../Icon/Icon.tsx";
import { EIcon } from "../../../Icon/Icon.types";
import * as Style from "./LiveInspector.style";

/**
 * Props of the LiveInspectorRow.
 */
interface ILiveInspectorRow {
  /**
   * Content of content to  the inspect.
   */
  content: string;
  /**
   * Time of the content
   */
  timestamp: number;
  /**
   * Title of the content
   */
  title: string;
  /**
   * id of the value
   */
  id: string;
}

const stateMemory: { [key: string]: boolean } = {};

/**
 */
function LiveInspectorRow(props: ILiveInspectorRow) {
  const { content, timestamp, title, id } = props;
  const [expand, setExpand] = useState<boolean>(stateMemory[id] || false);

  let code = props.content;
  try {
    if (typeof content === "object") {
      code = JSON.stringify(content, null, 4);
    } else {
      code = JSON.stringify(JSON.parse(content), null, 4);
    }
  } catch (e) {
    code = JSON.stringify(content);
  }

  return (
    <>
      <Style.Row onClick={() => setExpand((stateMemory[id] = !expand))}>
        <Icon icon={EIcon[expand ? "caret-down" : "caret-right"]} />
        <div className="time">
          [{getDateTimeObject(timestamp)?.toFormat("HH:mm:ss")}]{" "}
        </div>
        <div className="title">{title}:</div>
        <div className="code-preview">{code}</div>
      </Style.Row>

      {expand && <Style.Code>{code}</Style.Code>}
    </>
  );
}

export default memo(LiveInspectorRow);
