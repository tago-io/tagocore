import styled from "styled-components";
import * as IconStyle from "../Icon/Icon.style";
import * as ButtonStyle from "../Button/Button.style";

/**
 */
export const Container = styled.fieldset`
  border: 1px solid ${(props) => props.theme.fieldsetBorder};
  border-radius: 3px;
  padding: 0px 10px;
  padding-top: 1rem;
  position: relative;

  > legend {
    font-weight: 500;
    display: flex;
    align-items: center;

    ${IconStyle.Container} {
      margin-right: 7px;
    }
  }

  > .config-button {
    position: absolute;
    right: 0px;
    top: -7px;
    z-index: 2;

    ${ButtonStyle.Container} {
      padding: 7px 13px;
      border-bottom-right-radius: 0;
      border-top-left-radius: 0;
    }
  }

  .description {
    color: ${(props) => props.theme.font2};
    margin-right: 50px;
  }
`;
