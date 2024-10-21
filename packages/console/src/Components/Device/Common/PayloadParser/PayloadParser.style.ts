import styled from "styled-components";

/**
 * The main style container.
 */
export const Container = styled.fieldset`
  border: 1px solid ${(props) => props.theme.fieldsetBorder};
  margin: 0;

  .fields {
    display: flex;

    .input-container {
      position: relative;
      flex: 1;
      margin-right: -1px;

      input {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
      }
    }

    button {
      flex: none;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
  }
`;

/**
 * The main style container.
 */
export const Description = styled.span`
  color: ${(props) => props.theme.font2};
  margin-bottom: 1rem;
  display: inline-block;
`;

/**
 */
export const IconContainer = styled.div`
  position: absolute;
  right: 10px;
  z-index: 4;
  top: 50%;
  transform: translate(0%, -50%);
  padding: 5px;
  border-radius: 3px;
  display: flex;
  align-items: center;

  cursor: pointer;

  &:hover {
    background: rgba(0, 0, 0, 0.07);
  }
  &:active {
    background: rgba(0, 0, 0, 0.14);
  }
`;
