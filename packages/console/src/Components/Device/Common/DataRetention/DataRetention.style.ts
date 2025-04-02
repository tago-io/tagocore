import styled, { css } from "styled-components";

export const Container = styled.fieldset<{ disabled: boolean }>`
  ${(props) =>
    props.disabled &&
    css`
      opacity: 0.5;
      pointer-events: none;
    `}
`;
