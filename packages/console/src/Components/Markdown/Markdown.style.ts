import styled, { css } from "styled-components";
import { fonts } from "../../theme.ts";

/**
 * Main container.
 */
export const Container = styled.div`
  word-wrap: break-word;

  img {
    max-width: 100%;
  }

  code {
    display: inline-block;
    font-family: Monospace;
    font-size: ${() => fonts.default};
    padding: 1px 7px;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
  }

  h1 {
    font-size: ${() => fonts.xlarge};
    margin-top: 2.5rem;
  }

  h2 {
    font-size: ${() => fonts.large};
    margin-top: 2rem;
  }

  h3 {
    font-size: ${() => fonts.medium};
    margin-top: 1.5rem;
  }

  p {
    margin-top: 5px;
  }

  hr {
    margin: 2.5rem 0px;
    height: 1px;
    opacity: 0.35;
  }

  /* ul {
    margin: 5px 0px;
  } */
`;

/**
 */
export const Img = styled.img`
  ${(props) =>
    props.src?.includes("logo-plugin-black") &&
    css`
      height: 40px;
      margin: 0 auto;
      display: flex;
      margin-top: 1rem;
    `}}
`;
