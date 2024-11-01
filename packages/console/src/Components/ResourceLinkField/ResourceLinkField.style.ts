import styled from "styled-components";
import * as ButtonStyle from "../Button/Button.style";
import * as InputStyle from "../Input/Input.style";
import * as OptionsPickerStyle from "../OptionsPicker/OptionsPicker.style";

/**
 * Main style container.
 */
export const Container = styled.div`
  display: flex;

  > ${OptionsPickerStyle.Container} {
    flex: 1;
    margin-right: -1px;

    ${InputStyle.Container} {
      /* glue the input to the button */
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }
  }

  ${ButtonStyle.Container} {
    /* "glue" the button to the input */
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    margin-left: 5px;
  }
`;
