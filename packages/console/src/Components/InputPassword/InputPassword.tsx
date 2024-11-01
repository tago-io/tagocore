import type { InputHTMLAttributes } from "react";
import { EIcon } from "../../index.ts";
import Icon from "../Icon/Icon.tsx";
import Input from "../Input/Input.tsx";
import Tooltip from "../Tooltip/Tooltip.tsx";
import * as Style from "./InputPassword.style";

interface IInputPassword extends InputHTMLAttributes<HTMLInputElement> {
  /**
   * Indicates if this component has invalid data.
   * If this is set to `true`, this component will get a red border.
   */
  error?: boolean;
  /**
   * Sets the message that will appear below the input if this component has an error.
   */
  errorMessage?: string;
  /**
   * Hint to show at the right side of the page.
   */
  hint?: string;
  /**
   * Ref for the input.
   */
  inputRef?: any;
}

/**
 */
function InputPassword(props: IInputPassword) {
  const { hint, inputRef } = props;
  return (
    <Style.Container>
      <Input {...props} ref={inputRef} type="password" />
      {hint && (
        <Tooltip text={hint}>
          <Style.Hint>
            <Icon icon={EIcon["question-circle"]} />
          </Style.Hint>
        </Tooltip>
      )}
    </Style.Container>
  );
}

export default InputPassword;
