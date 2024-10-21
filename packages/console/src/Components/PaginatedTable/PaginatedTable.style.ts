import { Link } from "react-router-dom";
import styled, { css } from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid ${(props) => props.theme.fieldsetBorder};
  border-radius: 5px;
  overflow: hidden;
  background: ${(props) => props.theme.background1};

  .content {
    display: flex;
    flex: 1;
    min-height: 0;
    overflow: auto;

    > div {
      width: 100%;
    }
  }

  .cell {
    padding: 0px 4px;
    white-space: nowrap;
    text-overflow: ellipsis;
    position: relative;
  }
`;

/**
 * CSS shared between all types of rows.
 */
const rowCSS = css<{ $highlightColor?: string }>`
  padding: 10px 10px;
  display: flex;
  align-items: center;
  min-width: 0;

  &:hover {
    .table-hover-edit {
      display: initial !important;
    }
  }

  .cell {
    flex: 1 1 0%;
    display: flex;
    align-items: center;

    .inner-cell:not(.date):not(.icon) {
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  &:nth-of-type(even) {
    background-color: ${(props) => props.theme.tableOddRow};
  }

  ${(props) =>
    props.$highlightColor &&
    css`
      &:hover {
        cursor: pointer;
        background: ${props.$highlightColor};
        * {
          color: white !important;
          fill: white !important;
        }
      }
    `}
`;

/**
 * Style for a link row (clickable).
 */
export const LinkRow = styled(Link)<{ $highlightColor?: string }>`
  ${rowCSS}
`;

/**
 * Style for a div row (not clickable).
 */
export const DivRow = styled.div<{ $highlightColor?: string }>`
  ${rowCSS}
`;

/**
 * Style for the filter container.
 */
export const FilterContainer = styled.div<{ disabled: boolean }>`
  ${(props) =>
    props.disabled &&
    css`
      pointer-events: none;
      opacity: 0.5;
    `}
`;

/**
 * Rows container style.
 */
export const Body = styled.div`
  flex: 1;

  .cell {
    /* overflow: hidden; */
    white-space: nowrap;
    display: flex;
    min-width: 0;
  }
`;

/**
 * Header style.
 */
export const Header = styled.div`
  display: flex;
  background: rgba(0, 0, 0, 0.05);
  padding: 7px 10px;
  align-items: center;
  flex: none;

  .cell {
    flex: 1;

    h2 {
      margin-bottom: 3px;
      font-weight: 500;
      display: inline-flex;
      align-items: center;

      i {
        margin-right: 5px;
      }
    }

    input,
    select {
      padding: 0px 12px;
      height: 27px;
    }
  }
`;

/**
 */
export const InnerContent = styled.div<{ minWidth: number }>`
  min-width: ${(props) => props.minWidth}px;
  display: flex;
  flex-direction: column;
  position: relative;
`;
