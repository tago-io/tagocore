import styled from "styled-components";
import * as FormGroupStyle from "../FormGroup/FormGroup.style";
import * as SelectStyle from "../Select/Select.style";

/**
 */
export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  flex: 1;
  background: ${(props) => props.theme.background1};
`;

/**
 */
export const Header = styled.div`
  width: 100%;
  background: ${(props) => props.theme.tableHeader};
  padding: 10px;
  display: flex;
  align-items: center;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.15);

  ${FormGroupStyle.Container} {
    display: flex;
    align-items: center;

    &:first-child {
      margin-right: 15px;
      padding-right: 15px;
      border-right: 1px solid rgba(0, 0, 0, 0.1);
    }

    label {
      margin: 0;
      margin-right: 10px;
    }
  }

  ${SelectStyle.Container} {
    &.channel {
      flex: none;
      width: 250px;
    }

    &.type {
      flex: none;
      width: 250px;
    }
  }
`;

/**
 * Contains the empty message.
 */
export const EmptyMessageContainer = styled.div`
  position: relative;
  flex: 1;
  padding: 10px;
  overflow: auto;

  .row {
    display: block;
    margin-bottom: 3px;
  }
`;
