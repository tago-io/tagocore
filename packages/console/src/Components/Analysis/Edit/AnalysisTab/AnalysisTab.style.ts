import styled from "styled-components";

export const Container = styled.div`
  flex: 1;
  display: flex;
  height: 100%;
  flex: 1;
  margin: -15px;

  > .data {
    flex: none;
    width: 550px;
    padding: 15px;
    overflow: auto;
  }

  > .console {
    flex: 1;
    border-left: 1px solid rgba(0, 0, 0, 0.1);
    height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
  }
`;

export const ConsoleHeader = styled.div`
  background: rgba(0, 0, 0, 0.04);
  display: flex;
  padding: 7px 10px;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  border-top: 1px solid rgba(0, 0, 0, 0.05);

  h2 {
    font-size: 1.1rem;
    font-weight: 500;
  }

  button {
    border: 1px solid rgba(0, 0, 0, 0.1);
  }

  button:first-child {
    margin-right: 5px;
  }

  .ban-append {
    margin-left: -1px;
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;
    padding: 0px 5px;
    height: 33px;
  }
`;
