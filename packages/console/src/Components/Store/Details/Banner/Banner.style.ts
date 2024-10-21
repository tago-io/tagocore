import styled, { css } from "styled-components";
import { ButtonStyle, LinkStyle, PluginImageStyle } from "../../../../index.ts";

/**
 */
export const Container = styled.div<{ backgroundColor?: string }>`
  display: flex;
  padding: 30px 30px;
  align-items: center;
  background-color: ${(props) => props.backgroundColor || "rgb(246,246,246)"};

  ${PluginImageStyle.Container} {
    background: white;
    display: flex;
    align-items: center;
    justify-content: center;
    flex: none;
    border-radius: 30px;
    box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.1);
    margin-right: 30px;
    position: relative;
    overflow: hidden;
    border: 0px;
  }
`;

/**
 */
export const Info = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;

  > .publisher {
    margin-top: 5px;
    font-weight: 500;
  }

  > .title {
    display: flex;
    align-items: center;

    > h1 {
      font-size: ${() => "1.6rem"};
    }

    > select {
      border: 0;
      background: rgba(0, 0, 0, 0.07);
      border-radius: 7px;
      padding: 7px 10px;
      margin-left: 10px;
      cursor: pointer;
      outline: 0;

      &:hover {
        background: rgba(0, 0, 0, 0.15);
      }
    }
  }

  > .description {
    margin-top: 5px;
    opacity: 0.5;
    font-size: ${() => "1.1rem"};
  }
`;

/**
 */
export const Install = styled.div<{ disabled?: boolean }>`
  flex: none;
  display: flex;
  flex-direction: column;
  width: 200px;
  margin-left: 30px;

  > ${LinkStyle.Local} {
    width: 100%;
    text-decoration: none;
  }

  ${ButtonStyle.Container} {
    padding: 15px;
    width: 100%;
    font-size: ${() => "1.1rem"};
    text-decoration: normal;
  }

  .error {
    margin-top: 10px;
  }

  ${(props) =>
    props.disabled &&
    css`
      ${ButtonStyle.Container} {
        pointer-events: none;
        opacity: 0.2;
      }
    `}
`;
