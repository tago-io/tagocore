import styled from "styled-components";

/**
 */
export const Container = styled.div`
  flex: none;
  width: 330px;
  padding: 0px 20px;
  display: flex;
  flex-direction: column;
  padding: 20px 20px;
  background: white;
  border-left: 1px solid rgba(0, 0, 0, 0.07);
  border-top: 1px solid rgba(0, 0, 0, 0.07);

  section:not(:last-child) {
    margin-bottom: 40px;
  }

  section {
    > h4 {
      font-size: 1.3rem;
      margin-bottom: 10px;
    }
  }
`;
