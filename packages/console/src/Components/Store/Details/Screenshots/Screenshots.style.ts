import styled, { css } from "styled-components";

/**
 */
export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;

  .top-part {
    flex: 1;
    display: flex;
    align-items: center;
    margin: 0px 10px;

    > .screenshot-container {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0px 10px;

      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        border-radius: 10px;
      }
    }
  }

  .dots-container {
    display: flex;
    justify-content: center;
  }
`;

/**
 */
export const Arrow = styled.div`
  flex: none;
  width: 50px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100px;
  cursor: pointer;

  &:hover {
    background: rgba(0, 0, 0, 0.1);
  }
`;

/**
 */
export const Dot = styled.div<{ selected: boolean }>`
  width: 10px;
  height: 10px;
  border: 1px solid rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  margin: 0px 3px;

  ${(props) =>
    props.selected &&
    css`
      background: black;
    `}
`;
