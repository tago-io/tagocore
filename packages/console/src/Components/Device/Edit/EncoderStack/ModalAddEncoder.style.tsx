import styled from "styled-components";
import { STACK_ITEM_HEIGHT } from "./EncoderStack.style";

/**
 */
export const Container = styled.div`
  border: 1px solid ${(props) => props.theme.fieldsetBorder};
  border-radius: 5px;
  overflow: hidden;
  position: relative;
  min-height: 400px;
  overflow: auto;
  background: ${(props) => props.theme.tableHeader};
`;

/**
 * Component for a render item or 'stack' in the list.
 */
export const Item = styled.div`
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
  background: white;
  display: flex;
  align-items: center;
  height: ${STACK_ITEM_HEIGHT}px;
  width: 100%;
  cursor: pointer;

  &:not(:last-child) {
    /* no border for last child */
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }

  .data {
    /* main data of the row (title, description) */
    display: flex;
    align-items: center;

    .index {
      /* index number (1, 2, 3, ...) */
      margin-right: 10px;
    }

    .texts {
      display: flex;
      flex-direction: column;

      > .title {
        /* setup name */
        font-weight: bold;
      }

      > .description {
        /* plugin name */
        color: rgba(0, 0, 0, 0.5);
      }
    }
  }

  /* Grip icon container */
  > .icon-container {
    display: flex;
    padding: 0px 10px;
  }
`;
