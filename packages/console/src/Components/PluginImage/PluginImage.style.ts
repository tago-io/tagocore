import styled from "styled-components";

/**
 */
export const Container = styled.div<{ width: number; height: number }>`
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 20%;
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: white;

  i svg {
    opacity: 0.3;
    position: relative;
    top: 1px;
  }

  img {
    object-fit: contain;
    width: 90%;
    height: 90%;
    border: 0;
  }
`;
