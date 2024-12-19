import type { SelectHTMLAttributes } from "react";
import ErrorMessage from "../ErrorMessage/ErrorMessage.tsx";
import * as Style from "./Select.style";

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
  placeholder?: string;
}

function Select(props: ISelectProps) {
  const { options, error, errorMessage } = props;

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
