import styled from "styled-components";

export const Container = styled.div<{ type?: string }>`
  display: flex;
  flex: 1;
  margin: -15px;
  max-height: calc(100% + 30px);

  section > .title {
    text-align: center;
    margin-bottom: 1rem;
    font-size: 15px;
    font-weight: bold;
    color: rgb(111, 111, 111);
    padding-bottom: 1rem;
    border-bottom: 1px solid ${(props) => props.theme.fieldsetBorder};
    display: flex;
    align-items: center;
    flex: none;
    justify-content: center;
  }
`;

export const LeftSection = styled.section`
  display: flex;
  flex-direction: column;
  flex: 1.4;
  border-right: 1px solid ${(props) => props.theme.fieldsetBorder};
  padding: 15px;
  overflow: auto;
  max-height: 100%;
  position: relative;
`;

export const RightSection = styled.section`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 15px;
  overflow: auto;
  max-height: 100%;
`;
