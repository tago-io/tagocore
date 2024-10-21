import styled from "styled-components";

/**
 */
export const Container = styled.div`
  padding: 10px;
  background: ${(props) => props.theme.background1};
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 3px;
  display: inline-block;
  position: relative;
  width: 100%;
  color: rgb(70, 70, 70);
  overflow: hidden;

  > .left-content {
    width: calc(100% - 80px);

    > .title {
      margin-bottom: 5px;
      display: flex;
      align-items: center;

      h2 {
        font-weight: bold;
        font-size: 1.1rem;
        margin-left: 7px;
      }
    }
  }

  > .right-content {
    position: absolute;
    right: -10px;
    top: -5px;
  }
`;
