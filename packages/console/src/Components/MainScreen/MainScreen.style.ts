import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
  width: 100%;
`;

export const Content = styled.div<{ sidebarOpen?: boolean }>`
  display: flex;
  flex: 1;
  margin-left: ${(props) => (props.sidebarOpen ? "270px" : "0px")};
  position: relative;
  transition: margin-left 0.5s;
  transition-timing-function: cubic-bezier(0.55, 0, 0.1, 1);
  overflow: auto;
  background: ${(props) => props.theme.background2};
`;
