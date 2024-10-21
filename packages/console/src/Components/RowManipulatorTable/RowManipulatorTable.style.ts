import styled from "styled-components";

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
    margin-right: 7px;
    flex: 1;
  }
`;

/**
 */
export const Body = styled.div`
  overflow: auto;
  padding: 7px;
`;

/**
 * The header style.
 */
export const Header = styled.div`
  background: ${(props) => props.theme.tableHeader};

  .slide-header {
    /* this div will align the cells horizontally */
    display: flex;
    align-items: center;

    > .offset {
      background: red;
      display: flex;
      flex: none;
      width: 81px;
    }
  }

  .cell {
    font-weight: 500;
    padding-top: 7px;
    padding-bottom: 7px;
  }

  .cell:first-child {
    margin-left: 7px;
  }
`;
