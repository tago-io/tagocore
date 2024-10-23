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
