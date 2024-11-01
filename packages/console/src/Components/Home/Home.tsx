import type {
  IComputerUsage,
  INetworkInfo,
  IOSInfo,
  ISummary,
} from "@tago-io/tcore-sdk/types";
import { memo, useEffect } from "react";
import setDocumentTitle from "../../Helpers/setDocumentTitle.ts";
import useApiRequest from "../../Helpers/useApiRequest.ts";
import Button from "../Button/Button.tsx";
import Icon from "../Icon/Icon.tsx";
import { EIcon } from "../Icon/Icon.types";
import Tooltip from "../Tooltip/Tooltip.tsx";
import TooltipText from "../TooltipText/TooltipText.tsx";
import ComputerUsage from "./ComputerUsage/ComputerUsage.tsx";
import * as Style from "./Home.style";
import Network from "./Network/Network.tsx";
import OperatingSystem from "./OperatingSystem/OperatingSystem.tsx";
import { Statistics } from "./Statistics/Statistics.tsx";
import Summary from "./Summary/Summary.tsx";

/**
 * This is the home page.
 */
function Home() {
  const {
    data: summary,
    mutate: mutateSummary,
    error: summaryError,
  } = useApiRequest<ISummary | null>("/summary");
  const { data: os } = useApiRequest<IOSInfo | null>("/hardware/os");
  const { data: network } = useApiRequest<INetworkInfo[] | null>(
    "/hardware/network",
  );
  const { data: usages, mutate: mutateUsages } = useApiRequest<
    IComputerUsage[] | null
  >("/hardware/usage");

  /**
   * Refreshes the data.
   */
  const refresh = () => {
    mutateSummary(() => null, true);
    mutateUsages(() => usages, true);
  };

  /**
   * Renders the operating system card.
   */
  const renderOperatingSystem = () => {
    return (
      <Style.Card data-testid="home-os">
        <div className="title">
          <h2>Operating System</h2>
        </div>
        <div className="content">
          <OperatingSystem os={os} />
        </div>
      </Style.Card>
    );
  };

  /**
   * Renders the summary card.
   */
  const renderSummary = () => {
    return (
      <Style.Card data-testid="home-summary">
        <div className="title">
          <TooltipText tooltip="Quick view of the items in each section of the application">
            <h2>Summary</h2>
          </TooltipText>

          <div>
            <Tooltip text="Refresh Statistics">
              <Button onClick={refresh}>
                <Icon icon={EIcon["sync-alt"]} />
              </Button>
            </Tooltip>
          </div>
        </div>
        <div className="content">
          <Summary error={summaryError} data={summary} />
        </div>
      </Style.Card>
    );
  };

  /**
   * Renders the `Network interfaces` card.
   */
  const renderNetworkInterfaces = () => {
    if (!network || network?.length === 0) {
      return null;
    }

    return (
      <Style.Card style={{ flex: "none" }}>
        <div className="title">
          <TooltipText tooltip="Quick view of the network interfaces of the system">
            <h2>Network Overview</h2>
          </TooltipText>
        </div>
        <div className="content">
          <Network data={network} />
        </div>
      </Style.Card>
    );
  };

  /**
   * Renders the `Computer Usage` card.
   */
  const renderComputerUsage = () => {
    return (
      <Style.Card data-testid="home-computer-usage">
        <div className="title">
          <TooltipText tooltip="Quick view of the amount of resources your computer is using">
            <h2>Computer Usage</h2>
          </TooltipText>
        </div>
        <div className="content">
          <ComputerUsage usages={usages} />
        </div>
      </Style.Card>
    );
  };

  /**
   * Sets the document title.
   */
  useEffect(() => {
    setDocumentTitle("Home");
  }, []);

  return (
    <Style.Container>
      <div className="home-row">
        {renderSummary()}
        {renderOperatingSystem()}
      </div>

      <div className="home-row">
        <div className="charts-column">
          <Statistics />
        </div>

        <div className="usage-column">
          {renderNetworkInterfaces()}
          {renderComputerUsage()}
        </div>
      </div>
    </Style.Container>
  );
}

export default memo(Home);
