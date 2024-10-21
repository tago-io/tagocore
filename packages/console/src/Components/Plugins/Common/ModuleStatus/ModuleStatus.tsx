import type { IPlugin, IPluginModule } from "@tago-io/tcore-sdk/types";
import { useCallback, useEffect, useState } from "react";
import { useTheme } from "styled-components";
import { EIcon, Icon } from "../../../../index.ts";
import Button from "../../../Button/Button.tsx";
import Capitalize from "../../../Capitalize/Capitalize.tsx";
import * as Style from "./ModuleStatus.style";

/**
 * Props.
 */
interface IModuleStatusProps {
  /**
   */
  data: IPlugin;
  /**
   */
  module: IPluginModule;
  /**
   * Called when this module gets started.
   */
  onStart: () => Promise<void>;
  /**
   * Called when this module gets stopped.
   */
  onStop: () => Promise<void>;
}

/**
 */
function ModuleStatus(props: IModuleStatusProps) {
  const { data, module, onStop, onStart } = props;
  const [state, setState] = useState(() => module.state);
  const { error } = module;
  const theme = useTheme();

  /**
   * Starts the service.
   */
  const start = useCallback(() => {
    setState("starting");
    setTimeout(onStart, 200);
  }, [onStart]);

  /**
   * Stops the service.
   */
  const stop = useCallback(() => {
    setState("stopping");
    setTimeout(onStop, 200);
  }, [onStop]);

  /**
   */
  useEffect(() => {
    if (module.state !== state) {
      setState(module.state);
      // setState("starting");
      // timeout.current = setTimeout(() => setState(module.state), 200);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [module.state]);

  const pluginRunning = data.state === "started";
  const loading = state === "starting" || state === "stopping";
  const started = state === "started";

  return (
    <Style.Container>
      <Style.Status running={pluginRunning}>
        <div className="title">
          <span>Module status:</span>&nbsp;
          {loading ? (
            <Icon icon={EIcon.spinner} rotate />
          ) : (
            <b>
              <Capitalize>{state}</Capitalize>
            </b>
          )}
        </div>

        {data.allow_disable && (
          <div className="buttons-container">
            <div className="buttons-inner">
              <Button onClick={start} disabled={loading || started || !pluginRunning}>
                Start
              </Button>
              <Button onClick={stop} disabled={loading || !started || !pluginRunning}>
                Stop
              </Button>
            </div>
          </div>
        )}
      </Style.Status>

      {error && !loading && pluginRunning && (
        <div className="error">
          <Icon color={theme.buttonDanger} icon={EIcon["exclamation-triangle"]} />
          <span>{error}</span>
        </div>
      )}
    </Style.Container>
  );
}

export default ModuleStatus;
