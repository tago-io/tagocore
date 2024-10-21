import styled, { css, keyframes } from "styled-components";
import { fonts } from "../../theme.ts";

const fadeIn = keyframes`
  from { opacity: 0 };
  to { opacity: 1 };
`;

/**
 */
export const Container = styled.div`
  position: fixed;
  left: 0px;
  top: 0px;
  right: 0px;
  bottom: 0px;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  animation: ${fadeIn} 0.2s;
`;

/**
 */
export const Icon = styled.div<{ backgroundColor?: string }>`
  align-items: center;
  background: hsl(0, 100%, 100%);
  border-radius: 15px;
  border: 4px solid ${(props) => props.backgroundColor};
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
  display: inline-flex;
  height: 47px;
  justify-content: center;
  width: 70px;
  margin-right: 10px;
`;

/**
 */
export const Header = styled.header<{ backgroundColor?: string }>`
  padding: 10px 15px;
  border-bottom: 1px solid ${(props) => props.theme.fieldsetBorder};
  flex: none;
  display: flex;
  justify-content: space-between;
  align-items: center;

  > div {
    display: flex;
    align-items: center;
  }

  h1 {
    font-size: ${() => fonts.large};
    font-weight: bold;
  }

  ${(props) =>
    props.backgroundColor &&
    css`
      background-color: ${props.backgroundColor};

      h1 {
        color: white;
      }
    `}
`;

/**
 */
export const Card = styled.div<{ height?: string; width?: string }>`
  position: relative;
  background: ${(props) => props.theme.background1};
  border-radius: 5px;
  overflow: hidden;
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.3);
  max-height: 90%;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: ${(props) => props.width || "400px"};
  height: ${(props) => props.height || null};

  > .content {
    padding: 15px;
    flex: 1;
    overflow: auto;
  }
`;
