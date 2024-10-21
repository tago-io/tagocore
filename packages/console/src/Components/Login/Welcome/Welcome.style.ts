import { readableColor } from "polished";
import styled from "styled-components";
import { SETUP_BUILDING_BLOCK_COLOR } from "../../Setup/SetupBackground/SetupBackground.style";

const Container = styled.div`
  color: black;
  margin-right: 10px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  position: relative;
  margin: 20px 0px;

  * {
    color: ${readableColor(SETUP_BUILDING_BLOCK_COLOR, "black", "white")};
  }

  > span {
    font-size: 20px;
    opacity: 0.6;
  }

  section {
    margin-top: 30px;
    display: flex;
    align-items: center;

    span {
      opacity: 0.6;
      font-size: 16px;
    }

    i {
      margin-right: 5px;
      position: relative;
      top: 1px;
    }

    svg {
      opacity: 1;
      fill: ${readableColor(SETUP_BUILDING_BLOCK_COLOR, "black", "white")};
    }
  }

  h1 {
    margin-top: 0px;
    font-size: 50px;
  }
`;

export { Container };
