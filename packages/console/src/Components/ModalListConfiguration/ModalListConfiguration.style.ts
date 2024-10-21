import styled from "styled-components";

/**
 */
export const Container = styled.div`
  flex: 1;
  height: 100%;
  display: flex;

  h2 {
    font-size: 1.1rem;
    font-weight: bold;
    margin-bottom: 10px;
  }

  > section {
    flex: 1;
  }

  > section:first-child {
    border-right: 1px solid rgba(0, 0, 0, 0.1);
    padding-right: 15px;
    margin-right: 15px;
  }

  .item:not(:last-child) {
    margin-bottom: 5px;
  }
`;
