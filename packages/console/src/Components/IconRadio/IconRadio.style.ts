import styled, { css } from "styled-components";
import * as IconStyle from "../Icon/Icon.style";

/**
 * Main style.
 */
export const Container = styled.div``;

/**
 * A single option.
 */
export const Option = styled.label<{
  color?: string;
  disabled?: boolean;
}>`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;

  ${(props) =>
    props.disabled &&
    css`
      pointer-events: none;
      opacity: 0.7;
    `}

  > input {
    float: left;
    vertical-align: middle;
    color: inherit;
    margin: 0;
  }

  > .content {
    display: flex;
    align-items: center;

    ${IconStyle.Container} {
      margin: 0px 10px;
    }

    .info {
      > .title {
        font-weight: bold;
        font-size: 1rem;
        color: ${(props) => props.color || "inherit"};
      }

      > .description {
        display: block;
        font-size: 12px;
        font-weight: 400;
        margin: 0;
        color: ${(props) => props.theme.font2};
      }
    }
  }
`;
