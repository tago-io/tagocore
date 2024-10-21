import styled, { keyframes } from "styled-components";

/**
 * The inner ball's animation.
 */
const spinnerAnimation = keyframes`
 0% {
   transform: scale(0);
 }

 100% {
   transform: scale(1.0);
   opacity: 0;
 }
`;

/**
 * Main style.
 */
export const Container = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .spinner {
    width: 40px;
    height: 40px;
    background-color: ${(props) => props.theme.font2};
    border-radius: 100%;
    animation: ${spinnerAnimation} 1s infinite ease-in-out;
  }
`;
