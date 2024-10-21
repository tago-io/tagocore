import styled from "styled-components";

/**
 * Main style.
 */
export const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;

  > div {
    flex: 1;
    border: 0;
    border-radius: 0;
  }
`;
