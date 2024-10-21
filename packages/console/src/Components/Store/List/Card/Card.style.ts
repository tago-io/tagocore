import { Link } from "react-router-dom";
import styled from "styled-components";

export const Container = styled(Link)`
  padding: 10px 10px;
  border-radius: 7px;
  background: white;
  box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.07);
  display: flex;
  cursor: pointer;
  transition: box-shadow 0.15s;
  flex: 1;
  margin: 3px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  text-decoration: none;
  min-width: calc(25% - 6px);
  max-width: calc(25% - 6px);
  min-height: 90px;
  flex: none;

  &:hover {
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.15);
  }

  > .icon-container {
    margin-right: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .data {
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  .data .description {
    margin: 8px 0px;
    color: rgba(0, 0, 0, 0.5);
    flex: 1;
    display: flex;
  }

  .data .title {
    display: flex;
    justify-content: space-between;
  }

  .data .title span {
    color: ${(props) => props.theme.font2};
  }
`;
