import Icon from "../../../Icon/Icon.tsx";
import { EIcon } from "../../../Icon/Icon.types";
import * as Style from "./Platforms.style";

/**
 * Props.
 */
interface IPlatformsProps {
  value: string[];
}

/**
 * Indicates what platforms a plugin can run on
 */
function Platforms(props: IPlatformsProps) {
  const { value } = props;

  /**
   * Renders a single platform.
   */
  const renderItem = (item: string) => {
    let title = "";
    let icon = null;
    let description = "";

    if (item === "mac-x64") {
      title = "MacOS x64";
      icon = EIcon.apple;
      description = "Runs on MacOS x64.";
    } else if (item === "win-x64") {
      title = "Windows x64";
      icon = EIcon.windows;
      description = "Runs on Windows x64.";
    } else if (item === "linux-x64") {
      title = "Linux x64";
      icon = EIcon.linux;
      description = "Runs on Linux x64.";
    } else if (item === "linux-arm64") {
      title = "Linux ARM64";
      icon = EIcon.linux;
      description = "Runs on Linux ARM64.";
    } else if (item === "linux-armv7") {
      title = "Linux ARMV7";
      icon = EIcon.linux;
      description = "Runs on Linux ARMV7.";
    } else if (item === "alpine-arm64") {
      title = "Alpine ARM64";
      icon = EIcon.alpine;
      description = "Runs on alpine ARM64.";
    } else if (item === "alpine-x64") {
      title = "Alpine x64";
      icon = EIcon.alpine;
      description = "Runs on alpine x64.";
    } else if (item === "any") {
      title = "Any";
      icon = EIcon.desktop;
      description = "Runs on any supported system.";
    }

    return (
      <Style.Item key={item}>
        <div className="icon-container">
          <Icon icon={icon as EIcon} size="25px" />
        </div>

        <div className="info">
          <div className="title">{title}</div>
          <div className="description">{description}</div>
        </div>
      </Style.Item>
    );
  };

  return <Style.Container>{value.map(renderItem)}</Style.Container>;
}

export default Platforms;
