import styled, { keyframes } from "styled-components";
import { fonts } from "../../../theme.ts";

const fadeIn = keyframes`
  from { opacity: 0 };
  to { opacity: 1 };
`;

/**
 */
export const Container = styled.div`
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.7);
  position: absolute;
  left: 0px;
  top: 0px;
  bottom: 0px;
  right: 0px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  z-index: 30;
  animation: ${fadeIn} 0.2s;

  > .inner {
    background: white;
    padding: 20px 50px;
    border-radius: 5px;
    box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.05);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    border: 1px solid rgba(0, 0, 0, 0.1);

    > .icon-container {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: black;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 10px;
    }

    > .texts {
      margin-bottom: 1rem;
      text-align: center;

      h1 {
        font-size: ${() => fonts.large};
      }

      span {
        margin-top: 3px;
        color: rgba(0, 0, 0, 0.6);
      }
    }

    button {
      width: 100%;
    }
  }
`;
