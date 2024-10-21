import styled from "styled-components";

const Field = styled.div<{ width?: string }>`
  display: inline-block;
  padding: 0px 15px;
  vertical-align: top;
  width: ${(props) => props.width};
`;

const ExplanationText = styled.div`
  text-align: center;
`;

export { ExplanationText, Field };
