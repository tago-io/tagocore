import styled from "styled-components";

export const Box = styled.div`
  padding: 8px 12px;
  width: 100%;
  background-color: ${(props) => props.theme.formControlDisabled};
  border-radius: 3px;
  border: 1px solid transparent;
  line-height: 1.25;
  display: block;

  * {
    color: ${(props) => props.theme.formControlDisabledFont};
  }
`;
