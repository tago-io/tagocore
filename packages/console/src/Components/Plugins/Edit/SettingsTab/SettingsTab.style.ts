import styled from "styled-components";
import * as AccordionStyle from "../../../Accordion/Accordion.style";

/**
 */
export const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  margin: -15px;
  max-height: calc(100% + 30px);
  height: 100%;

  > .content {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: auto;

    > .horizontal {
      display: flex;
      flex-direction: row;
      flex: 1;
      height: 100%;
    }
  }
`;

/**
 */
export const LeftSection = styled.section`
  display: flex;
  flex-direction: column;
  flex: 1.4;
  border-right: 1px solid rgba(0, 0, 0, 0.1);
  padding: 15px;
  overflow: auto;
  max-height: 100%;
  position: relative;

  > .first-section {
    display: flex;
    margin-bottom: 1rem;

    > .main-info-container {
      flex: 1;
    }

    > .resources-container {
      flex: 1;
      border-left: 1px solid rgba(0, 0, 0, 0.1);
      padding-left: 15px;
    }

    > .buttons-container {
      flex: none;
      width: 200px;
      border-left: 1px solid rgba(0, 0, 0, 0.1);
      padding-left: 15px;
    }
  }

  > .markdown-container {
    flex: 1;
  }
`;

/**
 */
export const RightSection = styled.section`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: auto;
  max-height: 100%;
  background: #f1f1f2;
  padding: 5px;

  ${AccordionStyle.Container} {
    border-radius: 0;
    border-left: 0;
    border-right: 0;
    border-top: 0;
    margin-bottom: 0;
  }
`;

/**
 */
export const ModuleSummary = styled.div`
  display: flex;
  flex-direction: column;
  flex: none;
  padding: 15px 0px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);

  .items {
    display: flex;
    flex-wrap: wrap;
    flex: 1;
  }

  .item {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
    flex: 1;
    min-width: 25%;

    > .info {
      display: flex;
      flex-direction: column;
      margin-left: 10px;

      > .type {
        color: rgba(0, 0, 0, 0.5);
      }
    }
  }
`;

/**
 */
export const Status = styled.div`
  > div {
    border-radius: 0;
    border-top: 0;
    border-left: 0;
    border-right: 0;
  }
`;
