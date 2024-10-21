import styled, { css } from "styled-components";

/**
 */
export const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;

  > .inner-form {
    display: flex;
    background: white;
    width: 800px;
    z-index: 10;
    justify-content: center;
    flex-direction: column;
    overflow: hidden;
    border-radius: 2px;
    box-shadow: 0px 4px 12px 0px rgba(0, 0, 0, 0.1);
    position: relative;
    height: 85%;
    min-height: 600px;
    max-height: 1200px;
  }
`;

/**
 */
export const Content = styled.div<{ isLoading: boolean }>`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 15px;
  overflow: auto;
  transition: opacity 0.2s;

  ${(props) =>
    props.isLoading &&
    css`
      opacity: 0.5;
      pointer-events: none;
    `}
`;

/**
 */
export const Title = styled.div`
  display: flex;
  justify-content: center;
  padding: 15px 0px;
  border-bottom: solid 1px ${(props) => props.theme.fieldsetBorder};
  flex-direction: column;
  align-items: center;

  > h1 {
    font-size: 30px;
    color: black;
  }

  > span {
    display: flex;
    color: rgba(0, 0, 0, 0.5);
    margin-top: 3px;
  }
`;
