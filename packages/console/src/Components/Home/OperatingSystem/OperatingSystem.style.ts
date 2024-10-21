import styled from "styled-components";
import { fonts } from "../../../theme.ts";

/**
 * Main style.
 */
export const Container = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 5px;
  height: 100%;

  .icon-container {
    position: relative;

    .little-icon {
      position: absolute;
      bottom: -3px;
      right: -5px;
      padding: 3px;
      background: white;
      border-radius: 15%;
      border: 1px solid rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
    }
  }

  .data {
    display: flex;
    flex-direction: column;
    margin-left: 15px;

    > h3 {
      font-weight: 500;
      font-size: ${fonts.xlarge};
    }

    > .description {
      color: ${(props) => props.theme.font2};
      margin-top: 3px;
      font-size: ${fonts.default};
    }
  }
`;
