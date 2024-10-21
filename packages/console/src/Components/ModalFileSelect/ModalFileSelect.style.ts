import styled, { css } from "styled-components";

/**
 */
export const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  height: 100%;
`;

/**
 * Style for the input container.
 */
export const InputContainer = styled.div``;

/**
 */
export const Files = styled.div`
  flex: 1;
  overflow: auto;
  border: 1px solid ${(props) => props.theme.fieldsetBorder};
  border-radius: 5px;
  position: relative;

  .empty-warning {
    font-style: italic;
    color: rgba(0, 0, 0, 0.5);
    margin-left: 30px;
    padding: 5px 0px;
  }
`;

/**
 */
export const SingleFile = styled.div<{
  selected: boolean;
  disabled: boolean;
  indentation: number;
}>`
  padding: 5px 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding-left: ${(props) => props.indentation * 10 + 10}px;

  > span {
    margin-left: 7px;
  }

  ${(props) =>
    props.selected &&
    !props.disabled &&
    css`
      background: ${props.theme.buttonPrimary} !important;

      * {
        color: white !important;
        fill: white !important;
      }

      &:active {
        background: hsl(207, 85%, 10%) !important;
      }
    `}

  ${(props) =>
    props.disabled &&
    css`
      opacity: 0.5;
      cursor: not-allowed;
    `}

  ${(props) =>
    !props.disabled &&
    css`
      &:hover {
        background: rgba(0, 0, 0, 0.1);
      }

      &:active {
        background: rgba(0, 0, 0, 0.2);
      }
    `}
`;

/**
 */
export const Message = styled.div`
  margin-bottom: 1rem;
  color: ${(props) => props.theme.font2};
`;
