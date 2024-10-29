import type { ILog, IPluginLogChannel } from "@tago-io/tcore-sdk/types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "styled-components";
import qs from "qs";
import setDocumentTitle from "../../Helpers/setDocumentTitle.ts";
import useApiRequest from "../../Helpers/useApiRequest.ts";
import Console from "../Console/Console.tsx";
import EmptyMessage from "../EmptyMessage/EmptyMessage.tsx";
import FormGroup from "../FormGroup/FormGroup.tsx";
import { EIcon } from "../Icon/Icon.types";
import InnerNav from "../InnerNav/InnerNav.tsx";
import Select, { type ISelectOption } from "../Select/Select.tsx";
import Loading from "../Loading/Loading.tsx";
import { getSocket } from "../../System/Socket.ts";
import * as Style from "./Logs.style";

/**
 * This page shows the logs of all channels in the application.
 */
function Logs() {
  const navigate = useNavigate();

  const [selectedChannel, setSelectedChannel] = useState<string>(() => {
    const query = qs.parse(window.location.search, { ignoreQueryPrefix: true });
    return String(query.channel || "") || "api";
  });

  const [selectedType, setSelectedType] = useState<string>(() => {
    const query = qs.parse(window.location.search, { ignoreQueryPrefix: true });
    return String(query.type || "") || "all";
  });

  const { data: channels } = useApiRequest<IPluginLogChannel[]>("/logs");
  const { data } = useApiRequest<ILog[]>(
    `/logs/${encodeURIComponent(selectedChannel)}`,
  );
  const [logs, setLogs] = useState<ILog[]>([]);
  const theme = useTheme();

  const loading = !channels || !data;

  /**
   * Returns a list of channel options.
   */
  const getChannelOptions = (): ISelectOption[] => {
    return (channels || []).map((x) => ({
      label: x.name,
      value: x.channel,
    }));
  };

  /**
   * Renders the header part of the page. The header contains filters.
   */
  const renderHeader = () => {
    return (
      <Style.Header>
        <FormGroup
          addMarginBottom={false}
          tooltip="Specify the log channel"
          label="Channel"
        >
          <Select
            className="channel"
            value={selectedChannel}
            onChange={(e) => {
              setSelectedChannel(e.target.value);
              setLogs([]);
            }}
            options={getChannelOptions()}
          />
        </FormGroup>

        <FormGroup
          addMarginBottom={false}
          tooltip="Specify the type of the logs for the channel"
          label="Type"
        >
          <Select
            className="type"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            options={[
              { label: "All", value: "all" },
              { label: "Verbose", value: "verbose" },
              { label: "Errors", value: "error" },
            ]}
          />
        </FormGroup>
      </Style.Header>
    );
  };

  /**
   */
  const filterLogs = () => {
    return (logs || []).filter((x) => {
      if (selectedType === "all") {
        return x;
      }
      if (selectedType === "verbose") {
        return (x as any).type === "log";
      }
      return (x as any).type === "error";
    });
  };

  /**
   * Renders the logs content in the middle of the page.
   */
  const renderContent = () => {
    const logsFiltered = filterLogs();

    if (!loading && logsFiltered.length === 0) {
      return (
        <Style.EmptyMessageContainer>
          <EmptyMessage icon={EIcon.scroll} message="Nothing here yet." />
        </Style.EmptyMessageContainer>
      );
    }

    if (loading) {
      return <Loading />;
    }

    return <Console data={logsFiltered} />;
  };

  /**
   */
  useEffect(() => {
    if (data) {
      setLogs(data);
    }
  }, [data]);

  /**
   * Sets the document title.
   */
  useEffect(() => {
    setDocumentTitle("Application Logs");
  }, []);

  /**
   * Makes the request to install the plugin.
   */
  useEffect(() => {
    function onLog(params: any) {
      setLogs((x) => [...x, params]);
    }

    getSocket().on("log::message", onLog);
    return () => {
      getSocket().off("log::message", onLog);
    };
  });

  /**
   * Attaches and detaches the plugin to get the logs in realtime.
   */
  useEffect(() => {
    getSocket().emit("attach", "log", selectedChannel);
    return () => {
      getSocket().emit("unattach", "log", selectedChannel);
    };
  }, [selectedChannel]);

  /**
   * Sets the query string parameters.
   */
  useEffect(() => {
    navigate(`/console/logs?channel=${selectedChannel}&type=${selectedType}`, {
      replace: true,
    });
  }, [selectedChannel, selectedType]);

  return (
    <Style.Container>
      <InnerNav
        color={theme.logs}
        description="Visualize the logs of the application and plugins."
        icon={EIcon.scroll}
        title="Application Logs"
      />
      {renderHeader()}
      {renderContent()}
    </Style.Container>
  );
}

export default Logs;
