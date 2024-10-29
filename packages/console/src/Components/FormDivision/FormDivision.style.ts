import styled, { css } from "styled-components";
import { fonts } from "../../theme.ts";
import * as IconStyle from "../Icon/Icon.style";

/**
 * Main style, holds everything together.
 */
export const Container = styled.div<{ $renderBorder?: boolean }>`
  margin-bottom: 1rem;

  ${(props) =>
    props.$renderBorder &&
    css`
      padding-top: 1rem;
      border-top: 1px solid ${props.theme.fieldsetBorder};
    `}

  > .title {
    display: flex;
    align-items: center;

    h2 {
      display: inline-block;
      font-weight: 500;
      font-size: ${fonts.medium};
    }

    ${IconStyle.Container} {
      margin-right: 7px;
    }
  }

  > .description {
    color: ${(props) => props.theme.font2};
    display: inline-block;
    margin-top: 2px;
  }
`;
