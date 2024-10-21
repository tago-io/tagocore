import styled from "styled-components";

/**
 */
export const Item = styled.div`
  margin: 3px 0px;

  .icon-container {
    width: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 7px;
    flex: none;

    img {
      width: 30px;
      height: 30px;
      object-fit: contain;
    }
  }

  > .content {
    display: flex;
    align-items: center;

    .info {
      > .title {
        font-weight: bold;
        font-size: 0.88rem;
        color: ${(props) => props.color || "inherit"};
      }

      > .description {
        display: block;
        font-size: 12px;
        font-weight: 400;
        margin: 0;
        opacity: 0.7;
      }
    }
  }
`;
