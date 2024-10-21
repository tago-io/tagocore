import type { ReactNode } from "react";
import * as Style from "./Capitalize.style";

/**
 * Props.
 */
interface ICapitalizeProps {
  children: ReactNode;
}

/**
 */
function Capitalize(props: ICapitalizeProps) {
  const { children } = props;
  return <Style.Container>{children}</Style.Container>;
}

export default Capitalize;
