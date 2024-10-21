import styled from "styled-components";
import { fonts } from "../../../theme.ts";

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100% + 30px);
  margin: -15px -15px;

  .input-container {
    padding: 7px 15px;
    background: rgba(0, 0, 0, 0.05);
    display: flex;

    input {
      margin-right: 10px;
    }

    button {
      flex: none;
      padding: 0px 15px;
      background: transparent;

      svg,
      svg * {
        fill: black !important;
      }

      &:hover {
        background: rgba(0, 0, 0, 0.1);
      }
      &:active {
        background: rgba(0, 0, 0, 0.2);
      }
    }
  }

  .plugin-list {
    flex: 1;
    overflow: auto;
  }
`;

export const Item = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding: 12px 15px;

  .info {
    display: flex;
    flex-direction: column;
    margin-left: 10px;
    flex: 1;

    span {
      color: rgba(0, 0, 0, 0.6);
    }

    .title {
      font-size: ${() => fonts.medium};
      font-weight: bold;
      margin-bottom: 3px;
      align-items: center;
      display: flex;
    }
  }

  button {
    width: 130px;
  }

  .installed {
    border-radius: 5px;
    background: rgba(0, 0, 0, 0.1);
    color: rgba(0, 0, 0, 0.6);
    padding: 2px 7px;
    margin-left: 5px;
    font-size: 0.73rem;
    font-weight: bold;
    position: relative;
    margin-right: 10px;
  }
`;
