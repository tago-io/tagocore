import styled, { keyframes } from "styled-components";
import * as IconStyle from "../../../Icon/Icon.style";

/**
 * Animation for fade in.
 */
const fadeIn = keyframes`
  from { opacity: 0 };
  to { opacity: 1 };
`;

/**
 */
export const Container = styled.span`
  display: inline-flex;
  align-items: center;
  position: relative;
`;

/**
 */
export const Name = styled.span<{ clickable?: boolean }>`
  cursor: ${(props) => (props.clickable ? "pointer" : "initial")};
  margin-right: 3px;
`;

/**
 */
export const IconContainer = styled.span<{ clickable?: boolean; size: string }>`
  position: relative;
  display: inline-flex;
  align-items: center;
  cursor: ${(props) => (props.clickable ? "pointer" : "initial")};
  top: ${(props) => (props.size === "medium" ? "1px" : "0px")};

  ${IconStyle.Container}:nth-child(1) {
    position: absolute;
  }

  ${IconStyle.Container}:nth-child(2) {
    position: relative;
    transform: scale(0.5);
    z-index: 1;
  }
`;

/**
 */
export const Tooltip = styled.div`
  position: absolute;
  border: 1px solid ${(props) => props.theme.fieldsetBorder};
  box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.1);
  background: ${(props) => props.theme.background1};
  border-radius: 5px;
  overflow: auto;
  width: 250px;
  z-index: 5;
  padding: 15px;
  top: calc(100% + 5px);
  font-weight: normal;
  animation: ${fadeIn} 0.2s;

  .domain {
    margin: 15px 0px;
    font-weight: 500;
    display: flex;
    align-items: center;
    margin-bottom: 0;

    span {
      margin-left: 10px;
    }
  }
`;
