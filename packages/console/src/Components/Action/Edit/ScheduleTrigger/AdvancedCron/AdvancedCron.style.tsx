import styled, { css } from "styled-components";
import { fonts } from "../../../../../theme.ts";
import * as InputStyle from "../../../../Input/Input.style";

const CronFieldsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: hsla(0, 0%, 0%, 0.07);
  width: auto;
  margin: 0 auto;
  padding: 3px;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
`;

const CronField = styled.span<{ highlighted?: boolean }>`
  color: rgba(0, 0, 0, 0.35);
  font-size: ${() => fonts.medium};
  margin: 0px 5px;
  display: inline-block;
  ${(props) =>
    props.highlighted &&
    css`
      color: rgba(0, 0, 0, 0.9);
    `}
`;

const CronInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  max-width: 700px;
  padding: 10px 50px;
  margin-bottom: 1rem;
  padding-top: 1rem;
`;

const CronInput = styled(InputStyle.Container)`\
  font-size: 2.5rem;
  border-radius: 10px;
  text-align: center;
  letter-spacing: 1px;
  height: auto;
`;

export { CronFieldsContainer, CronField, CronInput, CronInputContainer };
