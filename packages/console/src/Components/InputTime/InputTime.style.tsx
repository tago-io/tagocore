import styled, { css } from "styled-components";

const Container = styled.div<{ hasFormat?: boolean }>`
  display: flex;
  position: relative;
  align-items: center;
  width: 100%;

  .time-separator {
    margin: 0px 3px;
  }

  ${(props) =>
    props.hasFormat &&
    css`
      /* stylelint-disable no-duplicate-selectors */
      select:nth-child(2) {
        border-radius: 0;
        margin-right: -1px;
      }
      select:nth-child(3) {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }
    `}
`;

export { Container };
