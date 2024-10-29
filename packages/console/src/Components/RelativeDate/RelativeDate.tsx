import { DateTime } from "luxon";
import getDateTimeObject from "../../Helpers/getDateTimeObject.ts";
import TooltipText from "../TooltipText/TooltipText.tsx";
import * as Style from "./RelativeDate.style";

/**
 * Props.
 */
interface IRelativeDateProps {
  /**
   * Value to be rendered.
   */
  value: string | number | Date | null | undefined;
  /**
   * Optional color for the text.
   */
  color?: string;
  /**
   * Optional setting to use the text as bold or not.
   */
  bold?: boolean;
  /**
   * Use a input-like element around the text to give the impression that the text is inside
   * of a disabled input element. This was created in order for the text to "blend-in" with
   * other inputs nearby.
   */
  useInputStyle?: boolean;
}

/**
 * Renders a date in a relative format, for example `2 hours ago`.
 */
function RelativeDate(props: IRelativeDateProps) {
  const { color, value } = props;
  const dateTime = getDateTimeObject(value);
  const relative = dateTime?.toRelative();

  let text = relative;

  if (!relative || !value || value === "never") {
    text = "Never";
  } else if (
    relative.toLowerCase() === "0 seconds ago" ||
    relative.toLowerCase() === "in 0 seconds"
  ) {
    text = "a few seconds ago";
  }

  const content = (
    <TooltipText
      bold={props.bold}
      color={color}
      tooltip={dateTime ? dateTime.toLocaleString(DateTime.DATETIME_FULL) : ""}
    >
      {text}
    </TooltipText>
  );

  if (props.useInputStyle) {
    return <Style.Box>{content}</Style.Box>;
  }
  return content;
}

export default RelativeDate;
