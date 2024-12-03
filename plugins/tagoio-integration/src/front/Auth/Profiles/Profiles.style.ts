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

  .item {
    border: 1px solid rgba(0, 0, 0, 0.1);
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.05);
    border-radius: 5px;
    padding: 10px;
    cursor: pointer;

    &:not(:last-child) {
      margin-bottom: 5px;
    }

    &:hover {
      background: rgba(0, 0, 0, 0.05);
    }

    &:active {
      background: rgba(0, 0, 0, 0.1);
    }
  }

  ${(props) =>
    props.loading &&
    css`
      opacity: 0.5;
      pointer-events: none;
    `}
`;
