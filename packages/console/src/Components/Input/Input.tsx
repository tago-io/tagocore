import { type InputHTMLAttributes, memo, forwardRef } from "react";
import ErrorMessage from "../ErrorMessage/ErrorMessage.tsx";
import * as Style from "./Input.style";

interface IInput extends InputHTMLAttributes<HTMLInputElement> {
  /**
   * Indicates if this component has invalid data.
   * If this is set to `true`, this component will get a red border.
   */
  error?: boolean;
  /**
   * Sets the message that will appear below the input if this component has an error.
   */
  errorMessage?: string;
}

/**
 * Default HTML input but with a style applied to it.
 */
function Input(props: IInput, ref: any) {
  const { error, errorMessage } = props;
  return (
    <>
      <Style.Container {...props} ref={ref} />
      {error && errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
    </>
  );
}

export default memo(forwardRef(Input));
