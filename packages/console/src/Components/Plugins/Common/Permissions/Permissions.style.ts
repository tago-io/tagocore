import styled from "styled-components";
import { fonts } from "../../../../theme.ts";

/**
 */
export const Container = styled.ul`
  display: flex;
  flex-direction: column;
  padding-left: 0;
  margin-bottom: 0;
  margin-top: 0;

  > i {
    color: ${(props) => props.theme.font2};
  }
`;

/**
 */
export const Item = styled.li`
  display: flex;
  margin-bottom: 10px;
  align-items: center;

  .icon-container {
    width: 30px;
    display: flex;
    flex: none;
    justify-content: center;
    margin-left: 10px;
  }

  &:before {
    content: "";
    width: 5px;
    height: 5px;
    background: black;
    border-radius: 50%;
  }

  &:last-child {
    margin-bottom: 0;
  }

  .info {
    margin-left: 10px;
  }

  .title {
    font-size: ${() => fonts.medium};
    font-weight: 500;
    margin-bottom: 2px;
  }

  .description {
    color: ${(props) => props.theme.font2};
  }
`;
