import styled from "styled-components";
import { fonts } from "../../../../../theme.ts";

const Container = styled.div`
  position: relative;
  height: 100%;

  > div {
    width: 100%;
  }

  .message {
    margin-top: 10px;
  }

  * {
    font-size: ${() => fonts.medium};
  }
`;

export { Container };
