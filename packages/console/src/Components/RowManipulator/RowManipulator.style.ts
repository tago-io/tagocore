import styled, { css } from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  .row {
    display: flex;
    align-items: center;

    .content {
      display: flex;
      align-items: center;
      flex: 1;
    }

    &:not(:first-child) {
      margin-top: 5px;
    }
  }
`;

export const Buttons = styled.div<{ $last: boolean }>`
  flex: none;
  display: flex;
  justify-content: center;
  width: 81px;

  button:nth-child(1) {
    margin-right: -1px;

    ${(props) =>
      !props.$last &&
      css`
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
      `}
  }

  button:nth-child(2) {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  button {
    padding: 0px 12px;
    height: 33px;
  }
`;
