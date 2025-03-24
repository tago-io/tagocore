import styled from "styled-components";
import FormControlStyles, {
  type FormControlProps,
} from "../Styles/FormControlStyles.ts";

export const Container = styled.input<FormControlProps>`
  ${FormControlStyles}
`;

export default Container;
