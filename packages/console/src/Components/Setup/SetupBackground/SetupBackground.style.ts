import { readableColor } from "polished";
import styled from "styled-components";

export const SETUP_BUILDING_BLOCK_COLOR = "rgb(230, 230, 230)";

const Container = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  max-width: 100%;
  background: rgb(240, 240, 240);
  position: fixed;

  .inner {
    display: flex;
    transform: rotate(45deg);
    width: 1650px;
    margin-left: -150px;
    margin-top: -110px;
  }

  .row {
    display: flex;
    justify-content: flex-end;
    flex: none;
    width: 600px;
    margin-top: 350px;
  }

  .col {
    display: flex;
    flex-direction: column;
    flex: none;
  }

  i svg {
    opacity: 0.04;
    fill: ${readableColor(SETUP_BUILDING_BLOCK_COLOR, "black", "white")};
  }
`;

const Device = styled.div`
  width: 600px;
  height: 600px;
  background: ${() => `linear-gradient(${SETUP_BUILDING_BLOCK_COLOR}, transparent)`};
  opacity: 0.8;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
`;

const Small = styled.div`
  width: 150px;
  height: 150px;
  background: ${() => `linear-gradient(transparent, ${SETUP_BUILDING_BLOCK_COLOR})`};
  opacity: 0.8;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 20px;
`;

const Bucket2 = styled.div`
  width: 1000px;
  height: 1000px;
  background: ${() =>
    `linear-gradient(${SETUP_BUILDING_BLOCK_COLOR}, ${SETUP_BUILDING_BLOCK_COLOR}, transparent)`};
  opacity: 0.8;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 20px;
  flex: none;
`;

const Bucket1 = styled(Bucket2)`
  position: absolute;
  transform: translateY(-100%);
  top: -20px;
  background: ${() =>
    `linear-gradient(transparent, ${SETUP_BUILDING_BLOCK_COLOR}, ${SETUP_BUILDING_BLOCK_COLOR})`};
`;

export { Bucket1, Bucket2, Small, Container, Device };
