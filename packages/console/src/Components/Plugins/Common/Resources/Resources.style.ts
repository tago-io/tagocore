import styled from "styled-components";

/**
 */
export const Container = styled.div`
  display: flex;
  flex-direction: column;

  .item {
    display: flex;
    margin-bottom: 5px;
    align-items: center;
  }

  .item:last-child {
    margin-bottom: 0;
  }

  .item i {
    margin-right: 5px;
  }
`;
