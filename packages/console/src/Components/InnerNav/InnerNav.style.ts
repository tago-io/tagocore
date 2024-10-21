import styled from "styled-components";
import { fonts } from "../../theme.ts";
import * as ButtonStyle from "../Button/Button.style";

/**
 * Main style.
 */
export const Container = styled.nav`
  display: flex;
  align-items: center;
  height: 40px;
  padding: 0px 15px;
  flex: none;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 8px 0px;
  justify-content: space-between;
  z-index: 2;
  position: relative;
  background: ${(props) => props.theme.background1};

  > section {
    height: 100%;
    display: flex;
    align-items: center;

    .title-data {
      display: flex;
      flex-direction: column;

      h1 {
        color: ${(props) => props.color};
        font-weight: 500;
      }

      span,
      b {
        font-size: ${fonts.small};
        color: ${(props) => props.theme.font2};
      }
    }
  }

  ${ButtonStyle.Container} {
    /* buttons should be a tiny bit smaller in this inner nav */
    padding: 5px 10px;
    white-space: nowrap;
  }
`;

/**
 */
export const LogoContainer = styled.div`
  border-right: 2px solid ${(props) => props.color};
  display: flex;
  height: 30px;
  flex: none;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  padding-right: 15px;
`;
