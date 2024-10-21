import { memo } from "react";
import * as Style from "./Loading.style";

/**
 * This component shows a tiny ball that expands and fades out. It indicates
 * that some processing is going on and the user needs to wait.
 */
function Loading() {
  return (
    <Style.Container>
      <div className="spinner" />
    </Style.Container>
  );
}

export default memo(Loading);
