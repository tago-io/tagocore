import styled, { css } from "styled-components";

/**
 * Main style for the component.
 */
export const Container = styled.span<{
  color?: string;
  bold?: boolean;
  $usesTooltip: boolean;
}>`
  ${(props) =>
    props.color &&
    css`
      color: ${props.color} !important;
      border-bottom-color: ${props.color} !important;
    `};

  ${(props) =>
    props.bold &&
    css`
      font-weight: ${props.bold ? "bold" : "normal"};
    `};

  ${(props) =>
    props.$usesTooltip &&
    css`
      border-bottom: 1px dotted black;
      margin-bottom: -1px;
    `}
`;
