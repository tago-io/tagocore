import { memo, type ReactNode } from "react";
import * as Style from "./Link.style";

/**
 * Props.
 */
interface ILinkProps {
  /**
   * Link to be passed to the inner DOM node.
   */
  href: string;
  /**
   * Target to be passed to the inner DOM node.
   */
  target?: string;
  /**
   * Text or content to be rendered inside of the link.
   */
  children?: ReactNode;
}

/**
 * A simple HTML `<a>` tag, with style.
 */
function Link(props: ILinkProps) {
  const { href, target } = props;

  return href.startsWith("/") ? (
    <Style.Local to={href} target={target}>
      {props.children}
    </Style.Local>
  ) : (
    <Style.External href={href} target={target}>
      {props.children}
    </Style.External>
  );
}

export default memo(Link);
