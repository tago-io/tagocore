import styled from "styled-components";
import * as ButtonStyle from "../Button/Button.style";

/**
 * Main style.
 */
export const Container = styled.footer`
  display: flex;
  background-color: ${(props) => props.theme.background1};
  border-top: solid 1px ${(props) => props.theme.fieldsetBorder};
  justify-content: space-between;
  padding: 3px 15px;
  min-height: 40px;
  align-items: center;

  ${ButtonStyle.Container} {
    /* buttons should be a tiny bit smaller in this footer */
    padding-top: 5px;
    padding-bottom: 5px;
  }
`;
