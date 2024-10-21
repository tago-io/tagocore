import styled from "styled-components";
import { Link } from "react-router-dom";

/**
 */
export const Local = styled(Link)`
  color: ${(props) => props.theme.link};

  &:hover {
    text-decoration: underline;
  }
`;

/**
 */
export const External = styled.a`
  color: ${(props) => props.theme.link};

  &:hover {
    text-decoration: underline;
  }
`;
