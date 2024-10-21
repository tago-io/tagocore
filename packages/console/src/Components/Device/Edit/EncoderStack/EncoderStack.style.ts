import styled, { css } from "styled-components";

export const STACK_ITEM_HEIGHT = 45;

/**
 */
export const Container = styled.div<{ itemAmount: number }>`
  .title {
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;

    .description {
      color: rgba(0, 0, 0, 0.5);
    }
    .text {
      flex: 1;
    }
  }

  > .stacks {
    border: 1px solid ${(props) => props.theme.fieldsetBorder};
    border-radius: 5px;
    position: relative;
    min-height: 234px;
    max-height: 700px;
    height: ${(props) => props.itemAmount * STACK_ITEM_HEIGHT + 2}px;
    overflow: auto;
    background: ${(props) => props.theme.tableHeader};
  }
`;

/**
 * Component for a render item or 'stack' in the list.
 */
export const Item = styled.div<{ selected: boolean; index: number }>`
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
  background: white;
  display: flex;
  align-items: center;
  height: ${STACK_ITEM_HEIGHT}px;
  position: absolute;
  width: 100%;
  top: ${(props) => props.index * STACK_ITEM_HEIGHT}px;
  transition: top 0.2s;
  padding-left: 10px;

  &:not(:last-child) {
    /* no border for last child */
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }

  .a {
    display: flex;
    align-items: center;
    flex: 1;

    .b {
      margin-right: 10px;
    }

    .c {
      display: flex;
      flex-direction: column;

      div {
        font-weight: bold;
      }
    }
  }

  .description {
    color: rgba(0, 0, 0, 0.5);
  }

  /* Grip icon container */
  > .icon-container {
    cursor: pointer;
    padding: 0px 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    opacity: 0.5;

    > div:nth-child(2) {
      margin-bottom: 3px;
    }

    svg * {
      fill: black;
    }

    > div {
      width: 15px;
      height: 2px;
      background: black;
      margin: -1px 0px;
    }
  }

  ${(props) =>
    /* Style for the selected item */
    props.selected &&
    css`
      background: ${props.theme.buttonPrimary};
      z-index: 10;

      * {
        color: white !important;
        fill: white !important;
      }

      > .icon-container {
        opacity: 1;
        div {
          background: white !important;
        }
      }
    `}
`;
