import type { ReactNode } from "react";
import * as Style from "./Footer.style";

/**
 * Props.
 */
interface IFooterProps {
  /**
   * Content to be rendered inside of this component.
   */
  children?: ReactNode;
}

/**
 * Default footer for the application.
 * This component will render the children inside of a `space-between` container.
 */
function Footer(props: IFooterProps) {
  return <Style.Container {...props}>{props.children}</Style.Container>;
}

export default Footer;
