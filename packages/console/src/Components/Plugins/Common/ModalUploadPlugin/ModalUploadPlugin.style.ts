import styled, { css, keyframes } from "styled-components";

/**
 * Animation of the progress bar.
 */
const animationEffectProgressBar = keyframes`
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 50px 50px;
  }
`;

/**
 * Progress bar of the modal.
 */
export const Progress = styled.div<{ done: boolean; error: boolean; value: number }>`
  width: 100%;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  height: 20px;
  overflow: hidden;
  position: relative;
  flex: none;

  > .value {
    width: ${(props) => props.value}%;
    background: ${(props) => props.theme.buttonPrimary};
    height: 100%;
    position: absolute;
    left: 0px;
    top: 0px;
    transition: width 0.2s;

    .effect {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      background-image: linear-gradient(
        -45deg,
        rgba(255, 255, 255, 0.2) 25%,
        transparent 25%,
        transparent 50%,
        rgba(255, 255, 255, 0.2) 50%,
        rgba(255, 255, 255, 0.2) 75%,
        transparent 75%,
        transparent
      );
      z-index: 1;
      background-size: 50px 50px;
      animation: ${animationEffectProgressBar} 2s linear infinite;
      border-top-right-radius: 8px;
      border-bottom-right-radius: 8px;
      border-top-left-radius: 20px;
      border-bottom-left-radius: 20px;
      overflow: hidden;
    }
  }

  ${(props) =>
    props.error &&
    css`
      > .value {
        background: ${props.theme.buttonDanger};
      }
    `}

  ${(props) =>
    props.done &&
    css`
      > .value {
        .effect {
          animation: none;
        }
      }
    `}
`;

/**
 * Description of the modal.
 */
export const Message = styled.div`
  margin-bottom: 1rem;
  color: ${(props) => props.theme.font2};
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  flex: none;
`;
