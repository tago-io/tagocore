import styled, { css } from "styled-components";

/**
 * Container of the item.
 */
export const Container = styled.div<{ error?: boolean }>`
  display: flex;
  position: relative;
  flex: none;
  border: 1px solid ${(props) => props.theme.fieldsetBorder};
  border-radius: 3px;
  flex-direction: column;
  margin-bottom: 1rem;
  transition: border-color 0.2s;

  > .content {
    padding: 10px;
    overflow: auto;
  }
`;

/**
 */
export const TitleBar = styled.div<{ isAlwaysOpen?: boolean; open?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  padding: 10px;

  ${(props) =>
    !props.isAlwaysOpen &&
    css`
      cursor: pointer;
      :hover {
        background: rgb(245, 245, 245);
      }
      :active {
        background: rgb(230, 230, 230);
      }
    `}

  > .left-side {
    flex: 1;
    display: flex;
    align-items: center;
    flex-direction: row;

    > i {
      margin: 0px 5px;
    }

    > .title {
      display: flex;
      align-items: flex-start;
      flex: 1;
      flex-direction: column;
      margin-left: 10px;

      .title-text {
        display: flex;
        align-items: center;

        span {
          color: hsl(0, 0%, 55%);
          display: block;
          margin-left: 5px;
        }
      }

      h3 {
        font-size: 1.1rem;
      }

      .description {
        color: hsl(0, 0%, 55%);
        display: block;
        margin-top: 3px;
      }
    }
  }

  > .right-side {
    display: flex;
    flex: none;
  }

  ${(props) =>
    props.open &&
    css`
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    `}
`;
