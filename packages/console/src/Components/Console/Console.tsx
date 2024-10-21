import type { ILog } from "@tago-io/tcore-sdk/types";
import { memo, useEffect, useRef } from "react";
import getDateTimeObject from "../../Helpers/getDateTimeObject.ts";
import EmptyMessage from "../EmptyMessage/EmptyMessage.tsx";
import type { EIcon } from "../Icon/Icon.types";
import * as Style from "./Console.style";

/**
 * Props.
 */
interface IConsoleProps {
  /**
   * Log messages.
   */
  data: ILog[];
  /**
   * If the date should also appear on the timestamp.
   */
  showDate?: boolean;
  /**
   * Keeps scrolling to the bottom when new logs arrive.
   */
  scrollToBottom?: boolean;
  /**
   * Icon to be rendered in the empty message.
   */
  emptyMessageIcon?: EIcon;
  /**
   * Message to be rendered when there are no records in the table.
   */
  emptyMessage?: string;
}

/**
 * This component shows a div that contains a bunch of rows, it's
 * supposed to look like a command line console.
 */
function Console(props: IConsoleProps) {
  const container = useRef<HTMLDivElement>(null);
  const { data, scrollToBottom, emptyMessage, emptyMessageIcon, showDate } = props;

  /**
   * Renders a single line.
   */
  const renderLog = (item: any, index: number) => {
    const format = showDate ? "yyyy-LL-dd HH:mm:ss.SSS" : "HH:mm:ss.SSS";
    const date = getDateTimeObject(item.timestamp)?.toFormat(format);
    return (
      <Style.Row error={item.error} key={item.timestamp + item.message + index}>
        <b className="date">[{date}]: </b>
        <span>{item.message}</span>
      </Style.Row>
    );
  };

  /**
   * Renders the empty message in the center of the table if there are no records in it.
   */
  const renderEmptyMessage = () => {
    if (!emptyMessage) {
      return null;
    }
    return <EmptyMessage icon={emptyMessageIcon as EIcon} message={emptyMessage} />;
  };

  /**
   * Scrolls the console along the scrollbar.
   */
  useEffect(() => {
    if (scrollToBottom) {
      const div = container.current as HTMLDivElement;
      if (div && data.length > 0) {
        const diff = Math.abs(div.scrollTop - div.scrollHeight + div.clientHeight);
        if (diff < 70) {
          div.scrollTop = div.scrollHeight;
        }
      }
    }
  }, [scrollToBottom, data.length]);

  if (data.length === 0 && emptyMessage) {
    // renders an empty message instead of an empty console
    return renderEmptyMessage();
  }

  return <Style.Container ref={container}>{data.map(renderLog)}</Style.Container>;
}

export default memo(Console);
