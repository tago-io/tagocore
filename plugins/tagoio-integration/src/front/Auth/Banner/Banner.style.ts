import styled from "styled-components";

export const Container = styled.div<any>`
  background: black;
  height: 100%;
  width: 40%;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  position: relative;
  padding: 20px;

  h2 {
    color: white;
    font-size: 29px;
    margin: 60px 0px;
    text-align: center;
    justify-content: center;
    display: flex;
    flex-direction: column;
    align-items: center;

    span {
      font-size: 1.1rem;
      color: white;
      font-weight: normal;
      opacity: 0.8;
      margin-top: 2px;
      display: flex;
    }
  }

  .block {
    height: 100px;
    display: flex;
    align-items: center;
  }

  .connection {
    display: flex;
    padding: 0px 0px;
    margin-bottom: 20px;
    align-items: center;
    justify-content: center;
  }
`;
