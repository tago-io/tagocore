import styled from "styled-components";

export const Container = styled.div<any>`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  .front {
    display: flex;
    position: relative;
    z-index: 10;
    height: 900px;
    max-height: calc(100% - 120px);
    width: 100%;
    max-width: 1300px;
  }

  @media screen and (max-width: 992px) {
    .front {
      justify-content: center;
    }
    .welcome {
      display: none;
    }
    .form {
      margin: 0px 10px;
    }
  }
`;
