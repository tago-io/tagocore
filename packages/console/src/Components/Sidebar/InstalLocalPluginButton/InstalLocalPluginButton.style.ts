import styled from "styled-components";
import * as ButtonStyle from "../../Button/Button.style";

/**
 * Style for the main container.
 */
export const Container = styled.div`
  text-align: right;
  padding: 3px 3px;

  ${ButtonStyle.Container} {
    border: 1px solid rgba(0, 0, 0, 0.07);
    width: 40px;
  }
`;
