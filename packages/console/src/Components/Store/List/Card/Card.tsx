import PluginImage from "../../../PluginImage/PluginImage.tsx";
import Publisher from "../../../Plugins/Common/Publisher/Publisher.tsx";
import * as Style from "./Card.style";

/**
 * Props.
 */
interface ICardProps {
  /**
   * Name of the plugin.
   */
  name: string;
  /**
   * Who published the plugin.
   */
  publisherName: string;
  /**
   * The unique ID for the plugin.
   */
  id: string;
  /**
   * Description.
   */
  description?: string;
  /**
   * Source of the plugin's logo.
   */
  logoURL: string;
  /**
   * Verified domain of the publisher.
   */
  publisherDomain?: string;
  /**
   * Latest version of the plugin.
   */
  version: string;
}

/**
 * Card of the plugin list.
 */
function Card(props: ICardProps) {
  const { id, logoURL, name, description, version, publisherDomain, publisherName } = props;

  return (
    <Style.Container to={`/console/pluginstore/detail/${id}`}>
      <div className="icon-container">
        <PluginImage width={60} src={logoURL} />
      </div>

      <div className="data">
        <div className="title">
          <h5>{name}</h5>
          <span>{version}</span>
        </div>

        <div className="publisher">
          <Publisher domain={publisherDomain} name={publisherName} />
        </div>

        {description ? (
          <span className="description">
            {description}
            {description.trim().endsWith(".") ? "" : "."}
          </span>
        ) : (
          <i className="description">This plugin has no description.</i>
        )}
      </div>
    </Style.Container>
  );
}

export default Card;
