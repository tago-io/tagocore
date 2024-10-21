import styled from "styled-components";

/**
 */
export const Container = styled.div`
  display: flex;
  align-items: center;

  > input:nth-child(1) {
    margin-right: -1px;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  > input:nth-child(2) {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
`;
