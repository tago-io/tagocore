import { Component } from "react";
import { createPortal } from "react-dom";
import Icon from "../Icon/Icon.tsx";
import { EIcon } from "../Icon/Icon.types";
import * as Style from "./Tooltip.style";

/*
 * Props.
 */
interface ITooltipPopup {
  align?: string;
  header?: string;
  icon?: EIcon;
  text?: any;
  color?: string;
  hoverable?: boolean;
  position?: string;
  zIndex?: number;
}

/**
 * State.
 */
interface IState {
  open: boolean;
}

/**
 * The popup for the tooltip. This is a class because we override
 * the shouldComponentUpdate and it can't be overridden for state using hooks.
 */
class TooltipPopup extends Component<ITooltipPopup> {
  public state = {
    open: false,
  };

  // @ts-ignore
  private ref: HTMLDivElement;
  private width = 0;
  private height = 0;

  /**
   * We override this event because the tooltip is an extremely sensitive component
   * since it's used in a ton of places in a system. We need to make sure it doesn't
   * update without a purpose.
   */
  public shouldComponentUpdate(nextProps: ITooltipPopup, nextState: IState) {
    if (!this.state.open && !nextState.open) {
      // closed, don't update
      return false;
    }
    return (
      this.props.align !== nextProps.align ||
      this.props.header !== nextProps.header ||
      this.props.icon !== nextProps.icon ||
      this.props.text !== nextProps.text ||
      this.props.color !== nextProps.color ||
      this.props.hoverable !== nextProps.hoverable ||
      this.props.position !== nextProps.position ||
      this.props.zIndex !== nextProps.zIndex ||
      this.state.open !== nextState.open
    );
  }

  /**
   * Calculates the size for the tooltip.
   */
  public calculateSize() {
    const bounds = this.ref.getBoundingClientRect();
    this.width = bounds.width;
    this.height = bounds.height;
  }

  /**
   * Opens the tooltip popup with the anchor data.
   */
  public open(anchorX: number, anchorY: number, anchorWidth: number, anchorHeight: number) {
    this.setState(
      {
        open: true,
      },
      () => {
        this.calculateSize();

        let x = anchorX;
        let y = anchorY;

        const { position, align } = this.props;

        if (align === "left") {
          x = anchorX;
        } else if (align === "right") {
          x = anchorX + anchorWidth - this.width;
        } else {
          // if no valid align was informed we use the 'center' one
          x = anchorX + anchorWidth / 2 - this.width / 2;
        }

        if (position === "bottom") {
          y = anchorY + anchorHeight + 5;
        } else {
          // if no valid position was informed we use the 'top' one
          y = anchorY - this.height - 5;
        }

        // validates x-axis bounds of screen:
        if (x + this.width >= window.innerWidth) {
          x = window.innerWidth - this.width - 5;
        } else if (x < 0) {
          x = 5;
        }
        // validates y-axis bounds of screen:
        if (y + this.height >= window.innerHeight) {
          y = window.innerHeight - this.width - 5;
        } else if (y < 0) {
          y = anchorY + anchorHeight + 5;
        }

        this.ref.style.left = `${x}px`;
        this.ref.style.top = `${y}px`;
        this.ref.classList.remove("invisible");
        this.ref.classList.add("visible");
      }
    );
  }

  /**
   * Closes the popup.
   */
  public close() {
    if (this.state.open) {
      this.ref.classList.remove("visible");
      this.ref.classList.add("invisible");
    }
  }

  /**
   * Main render function.
   */
  public render() {
    const { header, icon, text, zIndex, color, hoverable } = this.props;

    if (!this.state.open) {
      return null;
    }

    return createPortal(
      <Style.Container
        zIndex={zIndex}
        vertical={!!header}
        hoverable={hoverable}
        color={color}
        ref={(e) => ((this as any).ref = e)}
        data-testid="tooltip"
      >
        {icon !== null && (
          <div className="header">
            <Icon icon={icon || EIcon["question-circle"]} />
            {header && <span>{header}</span>}
          </div>
        )}

        <div className="content">{text}</div>

        {hoverable && <div className="hoverable-step" />}
      </Style.Container>,
      document.body
    );
  }
}

export default TooltipPopup;
