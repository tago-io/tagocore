import { Link } from "react-router-dom";
import styled, { css } from "styled-components";

/**
 * Main style container.
 */
export const Container = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid ${(props) => props.theme.fieldsetBorder};
  border-radius: 5px;
  overflow: hidden;

  .cell {
    white-space: nowrap;
    min-height: 35px;
    display: flex;
    align-items: center;
    padding-right: 7px;
  }

  .cell:first-child {
    padding-left: 7px;
  }
`;

/**
 * Rows container style.
 */
export const Body = styled.div`
  overflow: auto;
  width: 100%;
  height: 100%;
  position: relative;
`;

/**
 * CSS shared between all types of rows.
 */
const rowCSS = css<{
  $useAlternateRowColor?: boolean;
  $highlightColor?: string;
}>`
  display: flex;
  align-items: center;
  display: inline-flex;
  min-width: 100%;

  ${(props) =>
    props.$useAlternateRowColor &&
    css`
      &:nth-child(even) {
        background-color: ${props.theme.tableOddRow};
      }
    `}

  ${(props) =>
    props.$highlightColor &&
    css`
      &:hover {
        background-color: ${props.$highlightColor};

        * {
          color: white;
          fill: white;
        }
      }
    `}
`;

/**
 * Style for a link row (clickable).
 */
export const LinkRow = styled(Link)<{
  $useAlternateRowColor?: boolean;
  $highlightColor?: string;
}>`
  ${rowCSS}
`;

/**
 * Style for a div row (not clickable).
 */
export const DivRow = styled.div<{
  $useAlternateRowColor?: boolean;
  $highlightColor?: string;
}>`
  ${rowCSS}
`;

/**
 * Header style.
 */
export const Header = styled.div`
  background: ${(props) => props.theme.tableHeader};

  .slide-header {
    /* this div will align the cells horizontally and will slide to match the body */
    display: flex;
    align-items: center;
  }

  .cell {
    font-weight: 500;
    padding-top: 7px;
    padding-bottom: 7px;
  }
`;
