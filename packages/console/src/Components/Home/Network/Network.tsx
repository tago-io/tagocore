import type { INetworkInfo } from "@tago-io/tcore-sdk/types";
import { memo } from "react";
import formatBytes from "../../../Helpers/formatBytes.ts";
import Icon from "../../Icon/Icon.tsx";
import { EIcon } from "../../Icon/Icon.types";
import * as Style from "./Network.style";

/**
 * Props.
 */
interface INetworkProps {
  data: INetworkInfo[];
}

/**
 * This is the content of the `Computer Usage` card in the home page.
 */
function Network(props: INetworkProps) {
  const { data } = props;

  /**
   * Renders a single usage.
   */
  const renderData = (item: any) => {
    const { ip, name, bytesTransferred, bytesDropped } = item;
    return (
      <Style.Item key={name}>
        <Icon size="40px" icon={EIcon["network-wired"]} />

        <div className="data">
          <h3>{name}</h3>
          <span className="ip">{ip}</span>
          <span className="description">
            Transferred: {formatBytes(bytesTransferred)}
          </span>
          <span className="description">
            Dropped: {formatBytes(bytesDropped)}
          </span>
        </div>
      </Style.Item>
    );
  };

  return (
    <Style.Container data-testid="home-network">
      {data.map(renderData)}
    </Style.Container>
  );
}

export default memo(Network);
