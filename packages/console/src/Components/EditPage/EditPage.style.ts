import styled from "styled-components";

/**
 * Main style of the component.
 */
export const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
  height: 100%;
  position: relative;
  background: ${(props) => props.theme.background2};
`;
