import styled, { css } from "styled-components";
import { fonts } from "../../../theme.ts";

/**
 * Main style.
 */
export const Container = styled.div<{ $loading?: boolean }>`
  display: flex;
  align-items: center;
  padding: 15px 5px;
  height: 100%;
  flex-direction: column;

  ${(props) =>
    props.$loading &&
    css`
      opacity: 0.5;
    `}

  > .space {
    width: 100%;
    height: 1px;
    flex: none;
  }
`;

/**
 */
export const Item = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  flex: 1;
  margin-bottom: 25px;

  .data {
    display: flex;
    flex-direction: column;
    margin-left: 20px;
    flex: 1;

    > .bar-container {
      /* container of the bar */
      display: flex;
      align-items: center;

      span {
        margin-left: 10px;
        font-size: ${fonts.medium};
        font-weight: 500;
      }
    }

    > h3 {
      /* title */
      font-size: ${fonts.medium};
      font-weight: 500;
    }

    > .description {
      /* grey-colored description */
      color: ${(props) => props.theme.font2};
      word-break: break-word;
    }
  }
`;

/**
 * The progress bar.
 */
export const Bar = styled.div<{ value?: number }>`
  height: 10px;
  border-radius: 5px;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.2);
  width: 100%;
  position: relative;
  margin: 7px 0px;

  &::before {
    background: ${(props) => props.theme.home};
    height: 100%;
    width: ${(props) => props.value}%;
    content: "";
    position: absolute;
    transition: width 0.35s;
  }
`;
