import styled, { css } from "styled-components";

/**
 * Main style.
 */
export const Container = styled.div`
  flex: 1;
  padding: 10px;
  overflow: auto;
  height: 100%;

  * {
    font-family: "Lucida Console", Monaco, monospace !important;
  }

  .date {
    color: rgba(0, 0, 0, 0.5);
  }
`;

/**
 * A single row.
 */
export const Row = styled.div<{ error: boolean }>`
  display: block;
  white-space: pre-wrap;

  ${(props) =>
    props.error &&
    css`
      * {
        color: ${props.theme.buttonDanger};
      }
    `}
`;
