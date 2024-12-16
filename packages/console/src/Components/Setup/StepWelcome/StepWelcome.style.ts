import styled from "styled-components";
import { fonts } from "../../../theme.ts";

export const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 100%;

  svg {
    height: 5rem;
    width: 100%;
    margin-top: 15px;
  }

  .texts {
    text-align: center;
    margin-top: 25px;

    display: flex;
    flex-direction: column;
    gap: 1rem;

    > div {
      text-align: center;
      font-size: ${() => fonts.medium};
      color: ${({ theme }) => theme.fontFaded};
    }

    span.next {
      background: #000;
      color: #fff;
      background: ${({ theme }) => theme.buttonPrimary};
      color: ${({ theme }) => theme.buttonPrimaryFont};
      padding: 3px 6px;
      display: inline-block;
      border-radius: 4px;
    }
  }

  h2 {
    font-size: 30px;
  }
`;
