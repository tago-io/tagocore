import styled from "styled-components";

/**
 */
export const Point = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2px;

  b {
    margin: 0px 3px;
  }

  &:before {
    content: " ";
    width: 6px;
    height: 6px;
    border-radius: 50%;
    margin-right: 7px;
    margin-left: 5px;
    background: black;
  }
`;
