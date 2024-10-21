import styled from "styled-components";

export const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 100%;

  .to-continue {
    display: flex;
    margin: 10px 0px;
  }

  > .decision span {
    display: inline-flex;
    margin: 0px 7px;
  }
`;
