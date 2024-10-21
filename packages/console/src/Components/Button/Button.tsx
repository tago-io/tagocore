import { type ButtonHTMLAttributes, forwardRef } from "react";
import { EButton } from "./Button.types";
import * as Style from "./Button.style";

/**
 * Props.
 */
export interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * This will control its color, size and fill properties.
   * The default value is `EButton.default`.
   */
  type?: any;
  /**
   * Optional background color to override the `type` property.
   */
  color?: string;
  /**
   * Optional test ID to find this component in tests.
   */
  testId?: string;
  /**
   * Adds a margin-right property to any icons inside of the component.
   * This exists in order to give have some space between the icons and the text.
   */
  addIconMargin?: boolean;
}

/**
 * This is a simple HTML button with a style.
 * It will render whatever you pass as children inside of the component.
 */
function Button(props: IButtonProps, ref: any) {
  const { addIconMargin, className, type, color, disabled, style, testId, onClick } = props;

  return (
    <Style.Container
      addIconMargin={addIconMargin}
      buttonType={type || EButton.default}
      className={className}
      color={color}
      data-testid={testId}
      disabled={disabled}
      onClick={onClick}
      ref={ref}
      style={style}
    >
      {props.children}
    </Style.Container>
  );
}

export default forwardRef(Button);
