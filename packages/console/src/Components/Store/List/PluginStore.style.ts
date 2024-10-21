import styled from "styled-components";
import { fonts } from "../../../theme.ts";

/**
 */
export const Container = styled.div`
  height: 100%;
  width: 100%;
  border: 0;
  display: flex;
  flex-direction: column;
  flex: 1;

  > .content {
    flex: 1;
    padding: 7px;
  }
`;

/**
 */
export const Grid = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  position: relative;
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
