import styled from "styled-components";
import { fonts } from "../../../theme.ts";

/**
 */
export const Container = styled.div`
  display: flex;
  width: 100%;
  min-height: 100%;
  flex-direction: column;
  overflow: auto;
  background: white;

  > .content {
    display: flex;
    width: 100%;
    flex: 1;
    overflow: hidden;

    .data-tabs-container {
      flex: 1;
      display: flex;
      position: relative;
      overflow: auto;
    }
  }
`;

/**
 */
export const ConnectErrorMsg = styled.div`
  > h1 {
    font-weight: bold;
    font-size: ${() => fonts.medium};
    margin-bottom: 3px;
  }
`;
