import styled from "styled-components";
import { fonts } from "../../theme.ts";

export const Container = styled.span`
  color: ${(props) => props.theme.buttonDanger};
  display: inline-block;
  font-size: ${() => fonts.small};
  font-weight: bold;
  margin-top: 5px;
  text-align: center;
`;
