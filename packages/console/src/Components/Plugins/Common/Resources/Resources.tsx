import { useTheme } from "styled-components";
import Icon from "../../../Icon/Icon.tsx";
import { EIcon } from "../../../Icon/Icon.types";
import Link from "../../../Link/Link.tsx";
import * as Style from "./Resources.style";

/**
 * Props.
 */
interface IResourcesProps {
  repositoryURL?: string;
  licenseURL?: string;
  changelogURL?: string;
}

/**
 * Renders the resources (links) of a plugin.
 */
function Resources(props: IResourcesProps) {
  const theme = useTheme();
  const { repositoryURL, licenseURL, changelogURL } = props;

  return (
    <Style.Container>
      {repositoryURL && (
        <div className="item">
          <Icon color={theme.link} icon={EIcon["chevron-right"]} size="12px" />
          <Link href={"#"}>Repository</Link>
        </div>
      )}

      {licenseURL && (
        <div className="item">
          <Icon color={theme.link} icon={EIcon["chevron-right"]} size="12px" />
          <Link href={"#"}>License</Link>
        </div>
      )}

      {changelogURL && (
        <div className="item">
          <Icon color={theme.link} icon={EIcon["chevron-right"]} size="12px" />
          <Link href={"#"}>Changelog</Link>
        </div>
      )}

      <div className="item">
        <Icon color={theme.link} icon={EIcon["chevron-right"]} size="12px" />
        <Link href={"#"}>Report Abuse</Link>
      </div>
    </Style.Container>
  );
}

export default Resources;
