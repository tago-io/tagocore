import type { IOSInfo } from "@tago-io/tcore-sdk/types";
import { memo } from "react";
import Icon from "../../Icon/Icon.tsx";
import { EIcon } from "../../Icon/Icon.types";
import Loading from "../../Loading/Loading.tsx";
import * as Style from "./OperatingSystem.style";

/**
 * Props.
 */
interface IOperatingSystemProps {
  /**
   * Value.
   */
  os: IOSInfo | null;
}

/**
 * This is the content of the `Operating System` card in the home page.
 */
function OperatingSystem(props: IOperatingSystemProps) {
  const { os } = props;
  if (!os) {
    return <Loading />;
  }

  /**
   * Gets the hardware icon.
   */
  const getHardwareIcon = () => {
    if (os.hardware === "raspberry-pi") {
      return EIcon["raspberry-pi"];
    }if (os.hardware === "rock-pi") {
      return EIcon["rock-pi"];
    }
  };

  /**
   * Gets the os icon.
   */
  const getIcon = () => {
    if (os.code === "windows") {
      return EIcon.windows;
    }if (os.code === "linux") {
      return EIcon.linux;
    }if (os.code === "mac") {
      return EIcon.apple;
    }
      return null;
  };

  const osIcon = getIcon();
  const hardwareIcon = getHardwareIcon();

  return (
    <Style.Container>
      {os.hardware ? (
        <div className="icon-container">
          <Icon size="50px" icon={hardwareIcon} />
          {osIcon && (
            <div className="little-icon">
              <Icon size="15px" icon={osIcon} />
            </div>
          )}
        </div>
      ) : (
        <div className="icon-container">
          <Icon size="50px" icon={osIcon || EIcon.desktop} />
        </div>
      )}

      <div className="data">
        <h3>{os.name || "-"}</h3>
        <span className="description">
          {os.version}
          {os.arch ? " • " : ""}
          {os.arch}
        </span>
      </div>
    </Style.Container>
  );
}

export default memo(OperatingSystem);
