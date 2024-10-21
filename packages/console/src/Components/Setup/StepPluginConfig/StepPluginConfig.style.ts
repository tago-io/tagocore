import styled, { css } from "styled-components";

export const Content = styled.div<{ isLoading: boolean }>`
  display: flex;
  flex-direction: column;
  flex: 1;
  transition: opacity 0.2s;

  > div {
    width: 100%;
    padding: 15px;
  }

  ${(props) =>
    props.isLoading &&
    css`
      opacity: 0.5;
      pointer-events: none;
    `}
`;
