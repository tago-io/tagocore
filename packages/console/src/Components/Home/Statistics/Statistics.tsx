import type { IStatistic } from "@tago-io/tcore-sdk/types";
import { observer } from "mobx-react";
import { memo, useEffect, useRef, useState } from "react";
import useApiRequest from "../../../Helpers/useApiRequest.ts";
import store from "../../../System/Store.ts";
import TooltipText from "../../TooltipText/TooltipText.tsx";
import EmptyMessage from "../../EmptyMessage/EmptyMessage.tsx";
import { EIcon } from "../../Icon/Icon.types";
import * as HomeStyle from "../Home.style";
import RequestChart from "../RequestChart/RequestChart.tsx";
import { getSocket } from "../../../System/Socket.ts";

/**
 * Statistics section of the home page.
 * This component contains two cards that show two different charts.
 */
function Statistics() {
  const [statistics, setStatistics] = useState<IStatistic[] | null>(null);
  const { data, error } = useApiRequest<IStatistic[] | null>("/statistics");
  const interval = useRef<any>();

  /**
   * Listens to a new hourly statistic.
   */
  useEffect(() => {
    function onNewStatistic(stat: IStatistic) {
      const item = statistics?.find((x) => x.time === stat.time);
      if (item) {
        item.input += stat.input;
        item.output += stat.output;
      } else {
        statistics?.push(stat);
      }
      setStatistics([...(statistics as IStatistic[])]);
    }

    getSocket().on("statistic::hourly", onNewStatistic);
    return () => {
      getSocket().off("statistic::hourly", onNewStatistic);
    };
  });

  /**
   * Attaches and detaches the socket to get the statistic updates in realtime.
   */
  useEffect(() => {
    if (store.socketConnected) {
      getSocket().emit("attach", "statistic");
      return () => {
        getSocket().emit("unattach", "statistic");
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.socketConnected]);

  /**
   * Sets the statistics interval.
   */
  useEffect(() => {
    interval.current = setInterval(() => {
      setStatistics([...(statistics as IStatistic[])]);
    }, 1000 * 60);

    return () => {
      clearInterval(interval.current);
    };
  }, [statistics]);

  /**
   * Sets the local statistics.
   */
  useEffect(() => {
    if (data) {
      setStatistics(data as IStatistic[]);
    }
  }, [data]);

  const errorMessage = error?.response?.data?.message || error?.toString?.();

  return (
    <>
      {/* Input */}
      <HomeStyle.Card>
        <div className="title">
          <TooltipText tooltip="How many POST requests are being executed per minute">
            <h2>Data input per minute</h2>
          </TooltipText>
        </div>
        <div className="content">
          {error ? (
            <EmptyMessage icon={EIcon["exclamation-triangle"]} message={errorMessage} />
          ) : (
            <RequestChart statistics={statistics} id="post" type="input" />
          )}
        </div>
      </HomeStyle.Card>

      {/* Output */}
      <HomeStyle.Card>
        <div className="title">
          <TooltipText tooltip="How many GET requests are being executed per minute">
            <h2>Data output per minute</h2>
          </TooltipText>
        </div>
        <div className="content">
          {error ? (
            <EmptyMessage icon={EIcon["exclamation-triangle"]} message={errorMessage} />
          ) : (
            <RequestChart statistics={statistics} id="get" type="output" />
          )}
        </div>
      </HomeStyle.Card>
    </>
  );
}

export default memo(observer(Statistics));
