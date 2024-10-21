import { darken } from "polished";
import styled, { css } from "styled-components";

/**
 * The main style container.
 */
export const Container = styled.div`
  display: flex;
  flex-direction: column;
  border-top: 1px solid ${(props) => props.theme.fieldsetBorder};
  margin: 0px -15px;
  flex: 1;
  overflow: auto;
  margin-bottom: -15px;
`;

/**
 * The header part of the inspector.
 */
export const Header = styled.div`
  display: flex;
  background: ${(props) => props.theme.tableHeader};
  padding: 7px 12px;

  > * {
    margin: 0px 3px;
  }
`;

/**
 */
export const Body = styled.div<{ isEmpty: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  position: relative;
  overflow: auto;
  background-color: hsl(0, 0%, 99%);
  border-top: solid 1px hsla(0, 0%, 0%, 0.07);
  border-bottom: solid 1px hsla(0, 0%, 0%, 0.07);

  * {
    font-size: 1.1rem;
  }

  ${(props) =>
    props.isEmpty &&
    css`
      text-align: center;
    `}
`;

/**
 */
export const Item = styled.div`
  border-top: 1px dotted rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
  padding-top: 5px;
  cursor: pointer;
  width: 100%;

  &:first-child {
    border: 0;
  }
`;

/**
 */
export const Row = styled.div`
  display: flex;
  align-items: center;
  padding: 0px 5px;

  div {
    font-family: monospace;
    font-size: 1rem;
    white-space: nowrap;
  }

  &:hover {
    background-color: ${(props) => darken(0.04, props.color || props.theme.buttonDefault)};
  }

  > .time {
    margin-right: 3px;
  }

  > .title {
    font-weight: bold;
  }

  > .code-preview {
    margin-left: 5px;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    color: hsl(208, 56%, 46%);
  }
`;

/**
 */
export const Code = styled.div`
  white-space: pre-wrap;
  font-size: 1rem;
  font-family: monospace;
  cursor: default;
  padding-left: 30px;
  background-color: rgba(0, 0, 0, 0.015);
`;
