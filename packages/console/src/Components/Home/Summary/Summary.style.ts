import styled, { css } from "styled-components";

/**
 * Main container.
 */
export const Container = styled.div<{ $loading: boolean }>`
  min-height: 85px;

  > .group {
    display: flex;
    flex-direction: row;

    &.separator {
      margin-top: 5px;
      padding-top: 5px;
      border-top: 1px solid rgba(0, 0, 0, 0.1);
    }
  }

  ${(props) =>
    props.$loading &&
    css`
      opacity: 0.5;
    `}
`;

/**
 */
export const Item = styled.div`
  display: flex;
  padding: 7px 0px;
  align-items: center;
  flex: 1;
  justify-content: space-between;

  &:nth-child(1) {
    padding-right: 10px;
    margin-right: 10px;
    border-right: 1px solid rgba(0, 0, 0, 0.1);
  }

  > .left {
    display: flex;
    align-items: center;

    i {
      margin-right: 10px;
    }
  }

  > .value {
    color: ${(props) => props.theme.home};
  }
`;
