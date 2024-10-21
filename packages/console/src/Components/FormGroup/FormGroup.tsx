import type { ReactNode } from "react";
import Icon from "../Icon/Icon.tsx";
import type { EIcon } from "../Icon/Icon.types";
import TooltipText from "../TooltipText/TooltipText.tsx";
import * as Style from "./FormGroup.style";

/**
 * Props.
 */
interface IFormGroupProps {
  /**
   * Content to be rendered inside of the form group.
   */
  children?: ReactNode;
  /**
   * Icon for the label of this form group.
   */
  icon?: EIcon;
  /**
   * Label/title of the form group.
   */
  label?: ReactNode;
  /**
   * Optional style for this component, it will be passed straight to the root component.
   */
  style?: React.CSSProperties;
  /**
   * Tooltip to underline the label. This is optional.
   */
  tooltip?: string;
  /**
   * Indicates if this component should add a margin bottom style or not. Default is `true`.
   */
  addMarginBottom?: boolean;
  /**
   *
   */
  required?: boolean;
}

function FormGroup(props: IFormGroupProps) {
  const { addMarginBottom, tooltip } = props;
  const useLabel = props.icon || props.label;

  /**
   * Renders the label of this form group.
   */
  const renderLabel = () => {
    return (
      <label>
        {props.icon && <Icon icon={props.icon} />}
        <TooltipText tooltip={tooltip}>{props.label}</TooltipText>
        {props.required && <span className="required">*</span>}
      </label>
    );
  };

  return (
    <Style.Container addMarginBottom={addMarginBottom} style={props.style}>
      {useLabel && renderLabel()}
      {props.children}
    </Style.Container>
  );
}

export default FormGroup;
