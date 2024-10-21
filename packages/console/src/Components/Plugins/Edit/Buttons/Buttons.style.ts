import styled from "styled-components";
import { fonts } from "../../../../theme.ts";
import * as ButtonStyle from "../../../Button/Button.style";

/**
 */
export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  align-items: center;
  justify-content: center;

  .update {
    padding: 17px 0px;
    font-size: ${() => fonts.medium};
  }

  a {
    margin-bottom: 5px;
    width: 100%;
  }

  ${ButtonStyle.Container} {
    /* style of the buttons */
    width: 100%;
    border: 1px solid rgba(0, 0, 0, 0.1);

    &:not(:last-child) {
      margin-bottom: 5px;
    }
  }
`;
