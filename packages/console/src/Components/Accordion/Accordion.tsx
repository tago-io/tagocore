import type { ReactNode } from "react";
import Icon from "../Icon/Icon.tsx";
import { EIcon } from "../Icon/Icon.types";
import * as Style from "./Accordion.style";

/**
 * Props.
 */
interface IAccordion {
  /**
   * Content to be rendered inside of this component.
   */
  children?: ReactNode;
  /**
   * Title to be rendered in the title bar.
   */
  title?: ReactNode;
  /**
   * Optional description to appear below the title.
   */
  description?: ReactNode;
  /**
   * Optional icon for the title bar.
   */
  icon?: EIcon;
  /**
   * Indicates if this component is open or not.
   * If this component is open its `children` will be rendered, otherwise they will be omitted.
   */
  open?: boolean;
  /**
   * Called when the user clicks on the title bar. This should toggle the `open` prop.
   */
  onChangeOpen?: (open: boolean) => void;
  /**
   * Indicates if this component can be open or not.
   * If this is set to `false` this component will always be open and will not be clickable.
   */
  isAlwaysOpen?: boolean;
  /**
   * Component to render on the right side of the accordion title.
   */
  onRenderRightSide?: () => ReactNode;
  /**
   * Sub-title by the side of the title.
   */
  subTitle?: string;
}

/**
 * This component shows an accordion that can be "expanded" by clicking on it.
 * When this component is expanded its children will be rendered.
 */
function Accordion(props: IAccordion) {
  const { icon, isAlwaysOpen, subTitle, title, children, description, onRenderRightSide } = props;
  const open = props.open || isAlwaysOpen;

  /**
   * Renders the text part of the accordion.
   */
  function renderTitle() {
    return (
      <div className="title">
        {title && (
          <div className="title-text">
            <h3>{title}</h3>
            <span>{subTitle}</span>
          </div>
        )}
        {description && <div className="description">{description}</div>}
      </div>
    );
  }

  /**
   * Renders the icon part of the accordion.
   */
  function renderIcon() {
    if (!icon) {
      return null;
    }
    return <Icon icon={icon} size="22px" />;
  }

  /**
   * Called when the main container is clicked.
   */
  const onClick = () => {
    if (!isAlwaysOpen) {
      props.onChangeOpen?.(!open);
    }
  };

  return (
    <Style.Container onClick={onClick}>
      <Style.TitleBar data-testid="title-bar" isAlwaysOpen={isAlwaysOpen} open={open}>
        <div className="left-side">
          {renderIcon()}
          {renderTitle()}
        </div>

        {isAlwaysOpen ? (
          <div className="right-side">{onRenderRightSide?.()}</div>
        ) : (
          <div className="right-side">
            {onRenderRightSide?.()}
            <Icon icon={open ? EIcon["caret-up"] : EIcon["caret-down"]} size={"16px"} />
          </div>
        )}
      </Style.TitleBar>

      {open && (
        <div className="content" onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
          {children}
        </div>
      )}
    </Style.Container>
  );
}

export default Accordion;
