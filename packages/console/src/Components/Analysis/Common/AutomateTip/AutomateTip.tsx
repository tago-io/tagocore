import { memo } from "react";
import Icon from "../../../Icon/Icon.tsx";
import { EIcon } from "../../../Icon/Icon.types";
import Link from "../../../Link/Link.tsx";
import * as Style from "./AutomateTip.style";

/**
 */
function AutomateTip() {
  return (
    <Style.Container>
      <div className="left-content">
        <div className="title">
          <Icon icon={EIcon.bolt} size="14px" />
          <h2>Automate your Analysis</h2>
        </div>

        <div>
          <span>If you want to trigger this Analysis based on a </span>
          <b>time interval</b>
          <span>, </span>
          <b>schedule</b>
          <span> or </span>
          <b> data from devices</b>
          <span>, you need to create an </span>
          <Link href="/console/actions/">Action</Link>.
        </div>
      </div>

      <div className="right-content">
        <Icon icon={EIcon.bolt} size="100px" color="rgba(0, 0, 0, 0.2)" />
      </div>
    </Style.Container>
  );
}

export default memo(AutomateTip);
