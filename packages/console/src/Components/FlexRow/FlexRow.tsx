import type { ReactNode } from "react";
import * as Style from "./FlexRow.style";

/**
 * Props.
 */
interface IFlexRow {
  children?: ReactNode;
}

/**
 * Component that renders the content side by side, in a horizontal line.
 * If the children are inputs, they will be "glued" together.
 */
function FlexRow(props: IFlexRow) {
  return <Style.Container>{props.children}</Style.Container>;
}

export default FlexRow;
