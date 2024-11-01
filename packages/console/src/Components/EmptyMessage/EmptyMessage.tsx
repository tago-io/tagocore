import { type ReactNode, memo } from "react";
import Icon from "../Icon/Icon.tsx";
import type { EIcon } from "../Icon/Icon.types";
import * as Style from "./EmptyMessage.style";

/**
 * Props.
 */
interface IEmptyMessageProps {
  icon: EIcon;
  message?: ReactNode;
}

/**
 * Renders a message indicating that the content is empty.
 */
function EmptyMessage(props: IEmptyMessageProps) {
  const { icon, message } = props;

  return (
    <Style.Container>
      <Icon icon={icon} size="40px" />
      <div className="message">{message}</div>
    </Style.Container>
  );
}

export default memo(EmptyMessage);
