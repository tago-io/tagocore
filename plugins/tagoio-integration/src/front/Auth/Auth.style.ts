import { darken } from "polished";
import styled from "styled-components";

export const Container = styled.div<any>`
  height: 100%;
  width: 100%;
  border: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  background: rgba(0, 0, 0, 0.02);

  .fake-link,
  a {
    cursor: pointer;
    color: ${(props) => props.theme.link};

    &:hover {
      color: ${(props) => darken(0.04, props.theme.link)};
    }
    &:active {
      color: ${(props) => darken(0.08, props.theme.link)};
    }
  }
`;

export const Inner = styled.div<any>`
  background: white;
  border-radius: 7px;
  height: 80%;
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;
  background: white;
  overflow: hidden;
  width: 1440px;
  max-width: calc(100% - 120px);
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.1);

  button {
    width: 100%;
  }

  .left {
    padding: 60px;
    position: relative;
    display: flex;
    align-items: center;
    height: 100%;
    flex: 1;
    overflow: auto;
  }

  .right {
    background: black;
    height: 100%;
    width: 40%;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    position: relative;

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
  }

  @media screen and (max-width: 992px) {
    .banner {
      display: none;
    }
  }
`;

export const Steps = styled.div`
  display: flex;
  margin: 0 auto;
  justify-content: center;
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translate(-50%, 0%);

  > div {
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.2);
    width: 10px;
    height: 10px;
    margin: 0px 3px;
    transition: background-color 0.3s;

    &.selected {
      background: black;
    }
  }
`;
