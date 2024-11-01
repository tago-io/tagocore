import { type ReactNode, memo } from "react";
import * as Style from "./Switch.style";
import type { ESwitchSize } from "./Switch.types";

/**
 * Props.
 */
interface ISwitchProps {
  /**
   * Indicates if the switch is selected or not.
   */
  value?: boolean;
  /**
   * Called when the user clicks on the switch.
   * This will its value by sending the new value as the first parameter.
   */
  onChange?: (newValue: boolean) => void;
  /**
   * Optional text/content that appears on the left-side of the switch.
   */
  children?: ReactNode;
  /**
   * If set to `true` the switch will be slightly faded-out and the user will
   * not be able to change its value.
   */
  disabled?: boolean;
  /**
   * Optional text to be rendered inside of the switch when it is selected.
   * By default this value is equal to `✓`.
   */
  selectedText?: string;
  /**
   * Optional text to be rendered inside of the switch when it is unselected.
   * By default this value is equal to `✕`.
   */
  unselectedText?: string;
  /**
   */
  selectedColor?: string;
  /**
   */
  unselectedColor?: string;
  /**
   * Optional parameter to control the size of the switch.
   */
  size?: ESwitchSize;
}

/**
 * This component is like a checkbox, but instead of a `checked`/`unchecked` state
 * it displays a `on`/`off` state.
 */
function Switch(props: ISwitchProps) {
  const selected = props.value || false;
  const selectedText = props.selectedText || "✓";
  const unselectedText = props.unselectedText || "✕";

  const selectedColor = props.selectedColor || "green";
  const unselectedColor = props.unselectedColor || "red";

  const { size, onChange } = props;
  const icon = selected ? selectedText : unselectedText;

  return (
    <Style.Container $stretch onClick={() => onChange?.(!selected)}>
      {props.children && <span className="text">{props.children}</span>}

      <Style.Rectangle
        size={size}
        selected={selected}
        disabled={props.disabled}
        $selectedColor={selectedColor}
        $unselectedColor={unselectedColor}
      >
        <Style.Slider selected={selected} />
        <Style.InnerText selected={selected}>{icon}</Style.InnerText>
      </Style.Rectangle>
    </Style.Container>
  );
}

export default memo(Switch);
