import styled, { css } from "styled-components";

/**
 * Main style of the component.
 */
export const Container = styled.div<{ $loading?: boolean }>`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;

  > .content {
    /* container of the content */
    flex: 1;
    padding: 15px;
    overflow: auto;
    min-height: 0;
    background: ${(props) => props.theme.background1};
    display: flex;
    flex-direction: column;
    transition: opacity 0.3s;
    opacity: ${(props) => (props.$loading ? 0.5 : 1)};
  }
`;

/**
 * A single tab's title.
 */
export const TabTitle = styled.div<{
  highlightColor?: string;
  selected?: boolean;
}>`
  cursor: ${(props) => (props.selected ? "default" : "pointer")};
  position: relative;
  padding: 8px 25px;
  margin-left: 0;
  white-space: nowrap;
  min-height: 40px;
  background-color: transparent;
  border: 1px solid transparent;
  border-radius: 3px;
  border-top: 3px solid transparent; /* thick border to transition when selected */
  display: inline-flex;
  align-items: center;
  box-shadow: none;
  transition: box-shadow 0.2s;

  ${(props) =>
    props.selected
      ? css`
          /* This css will be executed when the tab is selected */
          background-color: ${props.theme.background1};
          border-bottom-left-radius: 0px;
          border-bottom-right-radius: 0px;
          border-top: 2px solid ${props.highlightColor};
          border-bottom: 0px;
          box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.1);
        `
      : css`
          /* This css will be executed when the tab is not selected */
          :hover {
            background-color: ${props.theme.tabTitleHover};
          }
          :active {
            background-color: ${props.theme.tabTitleActive};
          }
        `};
`;

/**
 * Main container for the tab titles.
 */
export const Titles = styled.div<{ backgroundColor?: string }>`
  overflow-x: auto;
  overflow-y: hidden;
  height: 40px;
  flex-wrap: wrap;
  white-space: nowrap;
  background: ${(props) => props.backgroundColor || props.theme.background2};
  display: inline-block;
`;
