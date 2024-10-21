import styled from "styled-components";
import { fonts } from "../../theme.ts";
import * as IconStyle from "../Icon/Icon.style";

/**
 * Main container.
 */
export const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  justify-content: center;
  align-items: center;

  > .message {
    margin-top: 5px;
  }

  > .message,
  > .message * {
    /* font-size: ${() => fonts.medium}; */
    color: ${(props) => props.theme.font3};
    text-align: center;
  }

  > ${IconStyle.Container} {
    opacity: 0.3;
  }
`;
