import styled, { css } from "styled-components";
import * as ButtonStyle from "../../../../Button/Button.style";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { IButtonContainerProps } from "../../../../Button/Button.style";

const Container = styled(ButtonStyle.Container)<{ pressed?: boolean }>`
  border: 1px solid rgba(0, 0, 0, 0.1);
  display: inline-flex;
  flex: 1;
  justify-content: center;
  user-select: none;
  margin: 0;
  margin-right: 3px;
  padding: 8px 12px;
  text-transform: uppercase;

  ${(props) =>
    props.pressed &&
    css`
      font-weight: bold;
      background-color: black !important;
      color: white;
    `}
`;

export { Container };
