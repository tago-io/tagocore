import styled from "styled-components";

export const DangerZone = styled.div`
  display: flex;
  justify-content: space-between;

  .info {
    display: flex;
    flex-direction: column;

    > span {
      color: rgba(0, 0, 0, 0.5);
    }
  }
`;
