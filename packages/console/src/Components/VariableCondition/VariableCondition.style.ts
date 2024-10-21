import { darken } from "polished";
import styled from "styled-components";
import { fonts } from "../../theme.ts";

/**
 * Container of the item.
 */
export const Container = styled.div<{ error?: boolean }>`
  display: flex;
  align-items: center;
  flex: 1;
  width: 100%;

  .text {
    font-size: 1.3rem;
    color: ${(props) => props.theme.font2};
    font-weight: bold;
    flex: none;
  }

  .space {
    margin: 0px 5px;
    flex: none;
  }

  .input-container {
    flex: none;
    width: 200px;
  }

  .condition-container {
    flex: 1;
    display: flex;
    position: relative;
    align-items: center;

    select {
      border-bottom-right-radius: 0;
      border-top-right-radius: 0;
      height: 33px;
      margin-right: -1px;
      min-width: 100px;
    }

    input {
      border-bottom-left-radius: 0;
      border-top-left-radius: 0;
      min-width: 70px;

      &:nth-of-type(2) {
        min-width: 120px;
      }
    }
  }
`;

export const FieldType = styled.div<{ color: string }>`
  position: absolute;
  right: 7px;
  top: 50%;
  transform: translate(0%, -50%);
  padding: 2px 4px;
  font-size: ${() => fonts.small};
  border-radius: 2px;
  cursor: pointer;
  border: 1px solid ${(props) => props.color};
  color: ${(props) => props.color};
  width: 40px;
  text-align: center;
  user-select: none; /* Standard */
  font-family: "Courier New", Courier, monospace;
  font-weight: bold;
  z-index: 10;

  :hover {
    background-color: ${(props) => darken(0.04, props.color)};
    border: 1px solid ${(props) => darken(0.04, props.color)};
    color: hsl(0, 100%, 100%);
  }

  :active {
    background-color: ${(props) => darken(0.08, props.color)};
    border: 1px solid ${(props) => darken(0.08, props.color)};
  }
`;
