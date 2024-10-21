import styled, { keyframes } from "styled-components";
import { fonts } from "../../../../../theme.ts";

const bobbingAnimation = keyframes`
  from { top: 10px }
  to { top: 0px }
`;

const Container = styled.div`
  height: 130px;
  position: relative;

  .message {
    margin-top: 10px;
  }

  * {
    font-size: ${() => fonts.medium};
  }
`;

const ArrowContainer = styled.div`
  position: absolute;
  right: 30px;
  top: 10px;

  i {
    position: relative;
    animation: ${bobbingAnimation} 1s infinite alternate-reverse;
  }
`;

export { Container, ArrowContainer };
