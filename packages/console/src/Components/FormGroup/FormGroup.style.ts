import styled from "styled-components";
import * as IconStyle from "../Icon/Icon.style";
import * as SwitchStyle from "../Switch/Switch.style";

/**
 * Main style.
 */
export const Container = styled.div<{ addMarginBottom?: boolean }>`
  margin-bottom: ${(props) => (props.addMarginBottom === false ? 0 : "1rem")};
  text-align: left;

  > label {
    margin-bottom: 0.5rem;
    font-weight: bold;
    font-size: 0.88rem;
    display: flex;
    align-items: center;

    ${IconStyle.Container} {
      margin-right: 7px;
    }

    > .required {
      margin-left: 3px;
      color: red;
      font-weight: bold;
    }
  }

  ${SwitchStyle.Container} {
    &:not(:first-child) {
      margin-top: 3px;
    }
  }
`;
