import { createGlobalStyle } from "styled-components";
import { fonts } from "../../theme.ts";
import * as IconStyle from "../Icon/Icon.style";

/**
 * Global styles for the application. Everything here will be applied
 * to all the corresponding elements.
 */
const GlobalStyles = createGlobalStyle`
  html,
  body {
    padding: 0;
    margin: 0;
    height: 100%;
    width: 100%;
    background: ${(props) => props.theme.background3}
  }

  pre {
    font-family: Monospace;
  }

  fieldset {
    border: 1px solid ${(props) => props.theme.fieldsetBorder};
    border-radius: 3px;
    padding: 0px 10px;
    padding-top: 1rem;
    background: rgba(0, 0, 0, 0.02);

    legend {
      font-weight: 500;
      display: flex;
      align-items: center;

      ${IconStyle.Container} {
        margin-right: 7px;
      }
    }
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: hsl(0, 0%, 76%);
  }

  ::-webkit-scrollbar {
    background: transparent;
    width: 8px;
    height: 8px;
  }

  body, * {
    font-family: ${fonts.fontFamily};
    color: ${(props) => props.theme.font};
    font-size: 0.88rem;
    box-sizing: border-box;
  }

  h1, h2, h3, h4, h5, h6 {
    margin: 0;
  }

  #root {
    height: 100%;
    width: 100%;
  }

  a {
    color: inherit;
    text-decoration: none !important;
  }
`;

export default GlobalStyles;
