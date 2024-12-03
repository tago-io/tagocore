import styled, { css } from "styled-components";

export const Container = styled.div<{ loading: boolean }>`
  transition: opacity 0.15s;
  width: 400px;
  margin: auto;

  .title-container {
    display: flex;
    align-items: center;

    h3 {
      font-size: 1.6rem;
      margin-bottom: 5px;
      flex: 1;
    }
  }

  ${(props) =>
    props.loading &&
    css`
      opacity: 0.5;
      pointer-events: none;
    `}
`;
