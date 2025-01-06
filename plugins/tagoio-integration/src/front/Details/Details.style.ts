import { theme } from "@tago-io/tcore-console";
import styled, { css, keyframes } from "styled-components";

const opacity = keyframes`
  from { opacity: 0 };
  to { opacity: 1 };
`;

export const Container = styled.div<any>`
  height: 100%;
  width: 100%;
  border: 0;
  display: flex;
  flex-direction: column;
  flex: 1;
  background: white;
  animation: ${opacity} 0.2s forwards;

  .eye {
    position: absolute;
    right: 20px;
    top: calc(40% - 0px);
    translate(0%, -50%);
    padding: 3px 5px;
    display: flex;
    border-radius: 5px;
    cursor: pointer;
    z-index: 111;

    &:hover {
      background: rgba(0, 0, 0, 0.1);
    }
    &:active {
      background: rgba(0, 0, 0, 0.15);
    }
  }

  .inner-profile {
    display: flex;

    input {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }

    button {
      white-space: nowrap;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
  }

  .connected-container {
    display: flex;
    align-items: center;

    .ball {
      width: 12px;
      height: 12px;
      background: ${(props) =>
        props.connected
          ? theme.lightTheme.buttonSuccess
          : theme.lightTheme.buttonDanger};
      margin-right: 5px;
      border-radius: 50%;
    }
  }

  .active-container {
    display: flex;
    margin-left: 15px;
    padding-left: 15px;
    border-left: 1px solid rgba(0, 0, 0, 0.1);
    align-items: center;
  }

  > .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 15px;
    overflow: hidden;

    .table-container {
      flex: 1;
      overflow: hidden;

      .table {
        overflow: auto;

        .data b {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 3px;
          padding: 1px 5px;
          margin: 0px 2px;
        }

        .data:nth-child(odd) {
          background: rgba(0, 0, 0, 0.05);
        }
      }

      > div {
        flex: 1;
        height: 100%;
        display: flex;
        flex-direction: column;
      }
    }

    .table {
      width: 100%;
      border-radius: 5px;
      border: 1px solid rgba(0, 0, 0, 0.1);
      overflow: auto;
      flex: 1;
      transition: opacity 0.2s;
      position: relative;

      > .header {
        font-weight: bold;
        display: flex;

        > span {
          padding: 10px;
          flex: 1;
          background: rgba(0, 0, 0, 0.05);
        }
      }

      > .data {
        display: flex;

        > span {
          padding: 10px;
          flex: 1;
          margin-top: -1px;
        }
      }
    }
  }

  ${(props) =>
    !props.enabled &&
    css`
      .table {
        background: rgba(0, 0, 0, 0.07);
        opacity: 0.7;
      }
    `}
`;
