import { memo, type ReactNode } from "react";
import type { EIcon } from "../../index.ts";
import Tooltip from "../Tooltip/Tooltip.tsx";
import * as Style from "./TooltipText.style";

/**
 * Props.
 */
interface ITooltipTextProps {
  /**
   * Contents of the component.
   */
  children: ReactNode;
  /**
   * Tooltip to appear when you hover over this component.
   */
  tooltip?: ReactNode;
  /**
   * Makes the text bold.
   */
  bold?: boolean;
  /**
   * Optional color of the text.
   */
  color?: string;
  /**
   * Icon of the tooltip.
   */
  icon?: EIcon | null;
}

/**
 * HTML span that shows a tooltip when the user hovers over this component.+
 */
function TooltipText(props: ITooltipTextProps) {
  const { icon, bold, color, tooltip, children } = props;
  const usesTooltip = !!tooltip;

  return (
    <Tooltip icon={icon} text={tooltip}>
      <Style.Container color={color} bold={bold} usesTooltip={usesTooltip}>
        {children}
      </Style.Container>
    </Tooltip>
  );
}

export default memo(TooltipText);
