import styled from "styled-components";
import { fonts } from "../../../../theme.ts";

const IntervalContainer = styled.div`
  display: flex;

  input,
  select {
    height: 60px;
    text-align: center;
  }

  select {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    font-size: ${() => fonts.xxlarge};
    color: ${(props) => props.theme.buttonSuccess};
    flex: none;
    width: 60%;
  }

  input {
    font-weight: bold;
    color: ${(props) => props.theme.buttonSuccess};
    margin-right: -1px;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    font-size: ${() => fonts.xxlarge};
    flex: none;
    width: 40%;

    ::placeholder {
      color: rgba(0, 0, 0, 0.2);
      font-size: ${() => fonts.large};
    }
  }
`;

export { IntervalContainer };
