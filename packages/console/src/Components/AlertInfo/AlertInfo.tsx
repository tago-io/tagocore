import type { ReactNode } from "react";
import * as Style from "./AlertInfo.style";
import type { EAlertInfo } from "./AlertInfo.types";

/**
 * Props.
 */
interface IAlertInfoProps {
  type: EAlertInfo;
  children: ReactNode;
}

/**
 * This component is an informative panel to highlight information.
 * This panel can have different colors and the colors are based on the 'type' received in the props.
 */
function AlertInfo(props: IAlertInfoProps) {
  return <Style.Container type={props.type}>{props.children}</Style.Container>;
}

export default AlertInfo;
