import type { ReactNode } from "react";
import Icon from "../Icon/Icon.tsx";
import type { EIcon } from "../Icon/Icon.types";
import * as Style from "./InnerNav.style";

/**
 * Props.
 */
interface IInnerNavProps {
  /**
   * Title of this component.
   */
  title: ReactNode;
  /**
   * Description of the component, will be rendered below the title.
   */
  description?: ReactNode;
  /**
   * Optional content to be rendered in the right side of this component.
   */
  children?: ReactNode;
  /**
   * Optional color, will be passed to the Icon component.
   */
  color?: string;
  /**
   * Icon to be used in this component. This can be overridden by the `image` prop.
   */
  icon?: EIcon;
  /**
   * Optional custom rendering of the icon.
   */
  onRenderIcon?: () => ReactNode;
}

/**
 * This is a page title nav-like element that shows an icon with a specific color,
 * a text, and a description of the screen.
 *
 * You can customize whatever appears on the right side of the component by using the children prop.
 */
function InnerNav(props: IInnerNavProps) {
  const { title, description, children, color, icon, onRenderIcon } = props;

  return (
    <Style.Container color={color}>
      <section>
        <Style.LogoContainer color={color}>
          {onRenderIcon !== undefined ? (
            onRenderIcon()
          ) : icon ? (
            <Icon size="20px" color={props.color} icon={icon} />
          ) : null}
        </Style.LogoContainer>

        <div className="title-data">
          <h1>{title}</h1>
          {description && <span>{description}</span>}
        </div>
      </section>

      <section>{children}</section>
    </Style.Container>
  );
}

export default InnerNav;
