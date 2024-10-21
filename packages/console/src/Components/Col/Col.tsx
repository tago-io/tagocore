import type { CSSProperties, ReactNode } from "react";
import * as Style from "./Col.style";

/**
 * Props.
 */
interface IColProps {
  size?: "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "11" | "12" | "auto";
  style?: CSSProperties;
  children?: ReactNode;
}

/**
 * Bootstrap column, the size is passed in the 'size' prop.
 */
function Col(props: IColProps) {
  return (
    <Style.Container style={props.style} size={props.size}>
      {props.children}
    </Style.Container>
  );
}

export default Col;
