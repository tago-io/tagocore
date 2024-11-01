import type { CSSProperties, ReactNode } from "react";
import * as Style from "./Row.style";

/**
 * Props.
 */
interface IRowProps {
  style?: CSSProperties;
  children?: ReactNode;
}

/**
 * Bootstrap row.
 */
function Row(props: IRowProps) {
  return (
    <Style.Container style={props.style}>{props.children}</Style.Container>
  );
}

export default Row;
