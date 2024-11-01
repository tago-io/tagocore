import type { SelectHTMLAttributes } from "react";
import ErrorMessage from "../ErrorMessage/ErrorMessage.tsx";
import * as Style from "./Select.style";

/**
 * A Single option.
 */
interface IOption {
  /**
   * Inner value of the option.
   */
  value: string;
  /**
   * Visual text for the option.
   */
  label: string;
  /**
   * The option will not be able to be selected.
   */
  disabled?: boolean;
}

/**
 * Props.
 */
interface ISelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  /**
   * Each one of these options will become a `<option />` tag inside of the select component.
   */
  options: IOption[];
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
 * It's the default HTML combo, but with style.
 */
function Select(props: ISelectProps) {
  const { options, error, errorMessage } = props;

  /**
   * Renders a single option.
   */
  const renderOption = (option: IOption) => {
    return (
      <Style.Option
        data-test
        key={option.value}
        value={option.value}
        disabled={option.disabled}
      >
        {option.label}
      </Style.Option>
    );
  };

  return (
    <>
      <Style.Container {...props}>{options.map(renderOption)}</Style.Container>
      {error && errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
    </>
  );
}

export default Select;
export type { IOption as ISelectOption };
