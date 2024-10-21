import styled from "styled-components";

export const ConfigHidden = styled.div`
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  flex: 1;
  width: 500px;
  margin: 0 auto;

  > i {
    opacity: 0.2;
  }

  .texts {
    margin: 10px 0px;
    display: flex;
    flex-direction: column;
    align-items: center;

    > span {
      color: rgba(0, 0, 0, 0.6);
    }
  }
`;
