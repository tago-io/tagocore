import styled from "styled-components";
import * as ButtonStyle from "../Button/Button.style";

/**
 * Main style.
 */
export const Container = styled.div`
  background-color: ${(props) => props.theme.background2};
  flex: 1;
  padding: 6px 0px;
  display: flex;
  flex-direction: column;

  .home-row {
    display: flex;
    width: 100%;
    padding: 0px 7px;
    min-width: 50%;
    overflow: hidden;

    &:nth-child(2) {
      flex: 1;
    }

    > .charts-column {
      flex: none;
      width: 50%;
      display: flex;
      flex-direction: column;
    }

    > .usage-column {
      flex: none;
      width: 50%;
      display: flex;
      flex-direction: column;
    }
  }
`;

/**
 */
export const Card = styled.div`
  background: ${(props) => props.theme.background1};
  flex: 1;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.1);
  margin: 3px;
  border-radius: 5px;
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.07);
  display: flex;
  flex-direction: column;

  > .title {
    display: flex;
    padding: 0px 15px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.07);
    height: 33px;
    align-items: center;
    justify-content: space-between;

    h2,
    h2 span {
      font-size: 1rem;
      font-weight: 500;
    }

    ${ButtonStyle.Container} {
      border: 0px;
      padding: 6px 8px;
    }
  }

  > .content {
    position: relative;
    padding: 7px 13px;
    flex: 1;
    overflow: auto;

    > div {
      transition: opacity 0.2s;
    }
  }
`;
