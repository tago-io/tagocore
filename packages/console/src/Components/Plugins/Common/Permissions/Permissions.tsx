import Icon from "../../../Icon/Icon.tsx";
import { EIcon } from "../../../Icon/Icon.types";
import * as Style from "./Permissions.style";

/**
 * Props.
 */
interface IPermissionsProps {
  value: string[];
}

/**
 * Indicates what permissions a plugin is requesting.
 */
function Permissions(props: IPermissionsProps) {
  const { value } = props;

  /**
   * Renders a single permission.
   */
  const renderPermission = (perm: string) => {
    let title = "";
    let icon = null;
    let description = "";

    if (perm === "device") {
      title = "Devices";
      icon = EIcon.device;
      description = "Create, modify, and delete devices.";
    } else if (perm === "action") {
      title = "Actions";
      icon = EIcon.bolt;
      description = "Create, modify, and delete actions.";
    } else if (perm === "analysis") {
      title = "Analyses";
      icon = EIcon.code;
      description = "Create, modify, and delete analyses.";
    } else if (perm === "plugin") {
      title = "Plugins";
      icon = EIcon["puzzle-piece"];
      description = "Install, modify, and uninstall plugins.";
    } else if (perm === "bucket-data" || perm === "device-data") {
      title = "Device data";
      icon = EIcon.cube;
      description = "Add and remove data in devices.";
    } else {
      return null;
    }

    return (
      <Style.Item key={perm}>
        <div className="icon-container">
          <Icon icon={icon as EIcon} size="20px" />
        </div>

        <div className="info">
          <div className="title">{title}</div>
          <div className="description">{description}</div>
        </div>
      </Style.Item>
    );
  };

  return (
    <Style.Container>
      {value.length > 0 ? (
        value.map(renderPermission)
      ) : (
        <i>This plugin doesn&apos;t require any permissions.</i>
      )}
    </Style.Container>
  );
}

export default Permissions;
