import type { TPluginType } from "@tago-io/tcore-sdk/types";
import Icon from "../../../Icon/Icon.tsx";
import { EIcon } from "../../../Icon/Icon.types";
import * as Style from "./ClassTypes.style";

/**
 * Props.
 */
interface IClassTypesProps {
  value: TPluginType[];
}

/**
 * Indicates what ClassTypes a plugin can run on
 */
function ClassTypes(props: IClassTypesProps) {
  const { value } = props;

  /**
   * Renders a single platform.
   */
  const renderItem = (item: TPluginType) => {
    let title = "";
    let icon = null;
    let description = "";

    if (item === "action-trigger") {
      title = "Action Trigger";
      icon = EIcon.bolt;
      description = "Creates one or more Action Triggers.";
    } else if (item === "action-type") {
      title = "Action Types";
      icon = EIcon.bolt;
      description = "Creates one or more Action Types.";
    } else if (item === "database") {
      title = "Database";
      icon = EIcon.database;
      description = "Creates one or more Databases.";
    } else if (item === "decoder") {
      title = "Payload Decoder";
      icon = EIcon.device;
      description = "Creates one or more Payload Decoders.";
    } else if (item === "encoder") {
      title = "Payload Encoder";
      icon = EIcon.device;
      description = "Creates one or more Payload Encoders.";
    } else if (item === "service") {
      title = "Service";
      icon = EIcon.cog;
      description = "Creates one or more services for running code.";
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

export default ClassTypes;
