import styled from "styled-components";
import * as FormGroupStyle from "../../../FormGroup/FormGroup.style";
import * as SimpleTableStyle from "../../../SimpleTable/SimpleTable.style";

/**
 * Main style for the token table.
 */
export const Container = styled.div`
  height: 250px;

  .buttons {
    /* these are the buttons of each row */
    flex: none;
    width: 100%;
    display: flex;
    justify-content: center;
    padding: 5px 0px;

    button {
      margin: 0px 3px;
    }
  }

  ${FormGroupStyle.Container} {
    width: 100%;
    margin-bottom: 0;

    button {
      /* make the 'generate' button stretch to match the form group */
      width: 100%;
      border: 0;
    }
  }

  ${SimpleTableStyle.Container} {
    /* make the table follow the height of this container  */
    height: 100%;
  }
`;
