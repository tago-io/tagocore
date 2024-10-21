import styled from "styled-components";
import { EAlertInfo } from "./AlertInfo.types";

/**
 * Returns the color for the alert type.
 */
function getAlertColor(props: any) {
  if (props.type === EAlertInfo.info) {
    return props.theme.alertInfoBackground;
  }
  if (props.type === EAlertInfo.warning) {
    return props.theme.alertWarningBackground;
  }
  if (props.type === EAlertInfo.danger) {
    return props.theme.alertDangerBackground;
  }
}

/**
 * Main container for the alert component.
 */
export const Container = styled.div<{ type: string }>`
  padding: 15px;
  border: solid 1px;
  border-radius: 3px;
  color: rgba(0, 0, 0, 0.6);
  background-color: ${getAlertColor};
  border-color: ${(props) => props.theme.fieldsetBorder};

  svg * {
    fill: rgba(0, 0, 0, 0.6);
  }
`;
