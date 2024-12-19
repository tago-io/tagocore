import styled from "styled-components";
import { ButtonStyle } from "../../../../index.ts";
import { fonts } from "../../../../theme.ts";
import * as PaginatedTableStyle from "../../../PaginatedTable/PaginatedTable.style";

export const Container = styled.div`
  flex: 1;
  display: flex;
  height: 100%;
  min-height: 0;

  ${PaginatedTableStyle.Container} {
    flex: 1;
    margin: -15px;
    margin-top: 0;
    border-radius: 0;
    border-left: 0;
    border-right: 0;
    border-bottom: 0;
  }
`;

export const Checkbox = styled.div`
  margin: -5px 0px;
  cursor: pointer;
`;

export const Pencil = styled.div`
  cursor: pointer;
  padding: 5px 7px;
  border-radius: 5px;
  display: none;
  margin: -5px 0px;
  margin-left: 5px;

  &:hover {
    background: rgba(0, 0, 0, 0.1);
  }

  &:active {
    background: rgba(0, 0, 0, 0.15);
  }

  i {
    opacity: 0.8;
    top: 1px;
    position: relative;
  }
`;

export const CopyButtonContainer = styled.div`
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);

  ${ButtonStyle.Container} {
    padding: 7px;
    width: 35px;
    background: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.1);
    }

    &:active {
      background: rgba(0, 0, 0, 0.15);
    }
  }
`;

export const LocationContainer = styled.div`
  text-overflow: ellipsis;
  width: 100%;
  display: flex;

  > span {
    overflow: hidden;
    text-overflow: ellipsis;
  }

  a {
    cursor: pointer;

    &:hover {
      opacity: 0.8;
    }
    &:active {
      opacity: 0.5;
    }
  }
`;

export const IDContainer = styled.div`
  text-overflow: ellipsis;
  overflow: hidden;
  width: 40px;
  display: flex;
  cursor: pointer;
  direction: rtl;
  text-align: left;

  * {
    font-family: SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace;
  }

  &:hover {
    opacity: 0.8;
  }
  &:active {
    opacity: 0.5;
  }
`;

export const ValueContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;

  > .value {
    margin-right: 5px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  > .type {
    font-size: ${() => fonts.small};
    opacity: 0.6;
  }
`;
