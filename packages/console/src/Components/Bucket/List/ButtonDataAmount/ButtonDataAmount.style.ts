import styled from "styled-components";
import { darken } from "polished";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Button, { IButtonProps } from "../../../Button/Button.tsx";

/**
 * Main style of the component.
 */
export const Container = styled(Button)`
  padding-top: 5px;
  padding-bottom: 5px;
  border: 0;
  background-color: transparent;
  width: 150px;
  position: absolute;
  top: 50%;
  transform: translate(0%, -50%);

  :hover {
    background-color: ${(props) => darken(0.04, props.theme.bucket)};
  }
  :active {
    background-color: ${(props) => darken(0.08, props.theme.bucket)};
  }
`;
