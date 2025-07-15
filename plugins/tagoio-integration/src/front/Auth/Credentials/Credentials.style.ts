import styled, { css } from "styled-components";

export const Container = styled.div<{ $loading: boolean }>`
  transition: opacity 0.15s;
  width: 400px;
  margin: 0 auto;

  h3 {
    font-size: 1.6rem;
    margin-bottom: 5px;
  }

  .tagoio-logo {
    display: inline-flex;
    vertical-align: bottom;
    margin: 0px 5px;
  }

  ${(props) =>
    props.$loading &&
    css`
      opacity: 0.5;
      pointer-events: none;
    `}
`;

export type FormControlStyleOptions = {
  disabled?: boolean;
  error?: boolean;
  readOnly?: boolean;
};

export const formControlStyles = css<FormControlStyleOptions>`
  outline-style: none;
  box-shadow: none;
  width: 100%;
  display: block;
  padding: 8px 12px;
  line-height: 1.25;
  margin: 0;
  border-width: 1px;
  border-style: solid;
  border-color: rgba(0, 0, 0, 0.1);
  transition:
    border-color 0.15s ease-in-out 0s,
    box-shadow 0.15s ease-in-out 0s;
  border-radius: 3px;
  color: ${(props) => props.theme.formControlFont};
  background-color: ${(props) => (props.theme as any).formControlBackground};
  height: 33px;

  :focus {
    /* applied when the element is focused */
    z-index: 1;
    position: relative;
    border-color: ${(props) =>
      !props.error && (props.theme as any).formControlFocus};
  }

  ::-moz-focus-inner {
    /* disables firefox's default focus color */
    border: 0;
  }

  :disabled {
    /* applied when the element is disabled */
    pointer-events: none;
    border-color: transparent;
    background-color: ${(props) => props.theme.formControlDisabled};
    color: ${(props) => (props.theme as any).formControlDisabledFont};
  }

  ${(props) =>
    props.readOnly &&
    css`
      border-color: transparent;
      background-color: ${props.theme.formControlDisabled};
      color: ${(props.theme as any).formControlDisabledFont};
    `}

  ${(props) =>
    props.error &&
    css`
      border-color: ${props.theme.buttonDanger};
      z-index: 1;
      position: relative;
    `}
`;

export const Select = styled.select`
  ${formControlStyles}
  padding: 0px 12px;
`;

export const SelectOption = styled.option``;
