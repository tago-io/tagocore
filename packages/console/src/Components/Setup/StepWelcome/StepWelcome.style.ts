import styled from "styled-components";
import { fonts } from "../../../theme.ts";

export const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 100%;

  svg {
    height: 50px;
    width: auto;
    margin-top: 15px;
  }

  .texts {
    text-align: center;
    margin-top: 25px;

    > div {
      text-align: center;
      opacity: 0.7;
      font-size: ${() => fonts.medium};
    }
  }

  h2 {
    font-size: 30px;
  }
`;
