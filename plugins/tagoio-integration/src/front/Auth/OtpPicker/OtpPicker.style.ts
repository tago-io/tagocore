import styled from "styled-components";

export const Container = styled.div`
  transition: opacity 0.15s;
  width: 400px;
  margin: auto;

  .title-container {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;

    h3 {
      font-size: 1.6rem;
      margin-bottom: 5px;
      flex: 1;
    }
  }
`;

export const Item = styled.div`
  padding: 10px 20px;
  display: flex;
  align-items: center;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 5px;
  margin-bottom: 5px;
  cursor: pointer;
  background: white;

  &:last-child {
    margin-bottom: 0px;
  }

  > .data {
    flex: 1;
    display: flex;
    align-items: center;

    .icon-container {
      width: 20px;
      margin-right: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }
  &:active {
    background: rgba(0, 0, 0, 0.1);
  }
`;
