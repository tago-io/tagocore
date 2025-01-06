import {
  Button,
  Col,
  EButton,
  EIcon,
  EmptyMessage,
  Footer,
  FormGroup,
  Icon,
  InnerNav,
  Input,
  Row,
  Switch,
  Tooltip,
} from "@tago-io/tcore-console";
import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useTheme } from "styled-components";
import imgDesert from "../../../assets/desert.png";
import * as Style from "./Details.style";

/**
 * Props.
 */
interface IDetailsProps {
  tcore: any;
  port: number;
  onSignOut: () => Promise<void>;
}

/**
 */
function Details(props: IDetailsProps) {
  const [active, setActive] = useState(props.tcore.active);
  const [signingOut, setSigningOut] = useState(false);
  const [connected, setConnected] = useState(active && window.navigator.onLine);
  const [effective, setEffective] = useState(active);
  const [events, setEvents] = useState<any>([]);
  const [ipVisible, setIPVisible] = useState(false);
  const socket = useRef<any>(null);

  const theme = useTheme() as any;

  const { onSignOut, port } = props;

  /**
   * Updates tcore in the API.
   */
  const updateTCoreInstance = useCallback(async () => {
    const { location } = window;
    await axios.put(
      `${location.protocol}//${location.hostname}:${port}/tcore`,
      { active },
    );
  }, [active]);

  /**
   * Called when the active changes.
   */
  const onChangeActive = useCallback((e: boolean) => {
    setActive(e);
  }, []);

  /**
   * Signs out.
   */
  const signOut = useCallback(async () => {
    try {
      setSigningOut(true);
      await onSignOut();
    } finally {
      setSigningOut(false);
    }
  }, [onSignOut]);

  /**
   */
  const onEvent = useCallback(
    (
      type: "send" | "receive",
      ev: string,
      timestamp: number,
      response: any,
    ) => {
      let extra = "";
      if (type === "receive") {
        extra = " (sent back 1 item)";
        if (Array.isArray(response)) {
          extra = ` (sent back ${response.length} items)`;
        }
      } else {
        extra = " (sent 1 item)";
        if (Array.isArray(response)) {
          extra = ` (sent ${response.length} items)`;
        }
      }

      const event: any = {
        event: ev,
        response: extra,
        type,
        timestamp: new Date(timestamp).toISOString(),
      };
      setEvents([event, ...events]);
    },
    [events],
  );

  /**
   */
  const onStatus = useCallback((ev: boolean) => {
    setConnected(ev);
  }, []);

  /**
   * Saves the record.
   */
  const save = useCallback(() => {
    setEffective(active);
    updateTCoreInstance();
  }, [active, updateTCoreInstance]);

  /**
   */
  useEffect(() => {
    if (effective) {
      if (!socket.current) {
        socket.current = io(
          `${location.protocol}//${location.hostname}:${port}`,
          { transports: ["websocket"] },
        );
        socket.current.connect();
      }

      socket.current.on("event", onEvent);
      socket.current.on("status", onStatus);
      socket.current.on("disconnect", () => onStatus(false));

      return () => {
        socket.current.off();
      };
    }
  }, [port, onEvent, onStatus, effective]);

  return (
    <Style.Container connected={connected && effective} enabled={effective}>
      <InnerNav
        color={theme.extension}
        description="View the details of the Integration with TagoIO's cloud platform"
        icon={EIcon.io}
        title="TagoIO Cloud Integration"
      >
        <div className="connected-container">
          <div className="ball" />
          <span>{connected && effective ? "Connected" : "Disconnected"}</span>
        </div>

        {!props.tcore.cluster && (
          <div className="active-container">
            <Switch value={active} onChange={onChangeActive}>
              Active
            </Switch>
          </div>
        )}
      </InnerNav>

      <div className="content">
        <Row>
          <Col size="4">
            <FormGroup
              label="Instance ID"
              icon={EIcon.tcore}
              tooltip="The unique ID for this TagoCore instance. This field will be automatically provided once you activate the integration."
            >
              <Input value={props.tcore.id} readOnly />
            </FormGroup>
          </Col>

          <Col size="2">
            <FormGroup
              icon={EIcon.globe}
              label="Internet IP"
              tooltip="This is the public IP of this computer"
            >
              <Input
                value={
                  ipVisible || !props.tcore.internet_ip
                    ? props.tcore.internet_ip
                    : String(props.tcore.internet_ip)
                        .split("")
                        .map((x) => (x === "." ? "." : "x"))
                        .join("")
                }
                readOnly
              />
              <Tooltip text="Press to view or hide Internet IP">
                <div className="eye" onClick={() => setIPVisible(!ipVisible)}>
                  <Icon icon={EIcon.eye} size="15px" />
                </div>
              </Tooltip>
            </FormGroup>
          </Col>

          <Col size="3">
            <FormGroup
              label="Local IPs"
              icon={EIcon["network-wired"]}
              tooltip="These are the local IPs of this computer in your network"
            >
              <Input value={props.tcore.local_ips} readOnly />
            </FormGroup>
          </Col>

          <Col size="3">
            <FormGroup
              label="Profile"
              icon={EIcon["user-alt"]}
              tooltip="Which TagoIO Cloud Profile is associated to this TagoCore instance."
            >
              <div className="inner-profile">
                <Input value={props.tcore.profile} readOnly />
                {!props.tcore.cluster && (
                  <Button
                    disabled={signingOut}
                    onClick={signOut}
                    type={EButton.primary}
                    addIconMargin
                  >
                    <Icon icon={EIcon["sign-out-alt"]} />
                    <span>Sign Out</span>
                  </Button>
                )}
              </div>
            </FormGroup>
          </Col>
        </Row>

        <div className="table-container">
          <FormGroup
            icon={EIcon.clock}
            label="Live Activity"
            tooltip="This table shows the whole activity history of communication between this TagoCore and your TagoIO Cloud Account. This information is only visible while you are seeing this page."
          >
            <div className="table">
              <div className="header">
                <span>Type</span>
                <span>Timestamp</span>
              </div>

              {events?.map((x: any, i: any) => (
                <div className="data" key={i}>
                  <span>
                    <span>
                      {x.type === "send" ? "Sent event" : "Received event"}{" "}
                    </span>
                    <b>{x.event}</b>
                    <span>{x.response}</span>
                  </span>
                  <span>{x.timestamp}</span>
                </div>
              ))}

              {events.length === 0 &&
                (effective ? (
                  <EmptyMessage
                    icon={null as any}
                    message={
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <img
                          style={{ opacity: 0.5, marginBottom: "1rem" }}
                          src={imgDesert}
                        />
                        <span>No activity yet.</span>
                      </div>
                    }
                  />
                ) : (
                  <EmptyMessage
                    icon={EIcon.io}
                    message="Activate the integration to communicate with TagoIO Cloud."
                  />
                ))}
            </div>
          </FormGroup>
        </div>
      </div>

      <Footer>
        <div />
        <div>
          <Button
            disabled={active === effective}
            onClick={save}
            type={EButton.primary}
          >
            Save
          </Button>
        </div>
      </Footer>
    </Style.Container>
  );
}

export default Details;
