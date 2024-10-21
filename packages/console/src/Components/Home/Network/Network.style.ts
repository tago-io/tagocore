import styled from "styled-components";
import { fonts } from "../../../theme.ts";

/**
 * Main style.
 */
export const Container = styled.div`
  display: flex;
  height: 100%;
  transition: opacity 0.1s;
  flex-wrap: wrap;

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
  min-width: 50%;
  padding: 10px 5px;

  .data {
    display: flex;
    flex-direction: column;
    margin-left: 20px;
    flex: 1;

    > h3 {
      /* title */
      font-size: ${fonts.medium};
      font-weight: 500;
    }

    > .ip {
      margin: 3px 0px;
    }

    > .description {
      /* grey-colored description */
      color: ${(props) => props.theme.font2};
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
