import type { IDevice } from "@tago-io/tcore-sdk/types";
import FormDivision from "../../../FormDivision/FormDivision.tsx";
import { EIcon } from "../../../Icon/Icon.types";
import LiveInspector from "../../Common/LiveInspector/LiveInspector.tsx";

/**
 * Props.
 */
interface ILiveInspectorTabProps {
  /**
   * Device's form data.
   */
  data: IDevice;
  /**
   * Indicates if the live inspector is enabled or not.
   */
  enabled: boolean;
  /**
   * Limit amount of records.
   */
  limit: number;
  /**
   * Logs of the inspector.
   */
  logs: any;
  /**
   * Called when the limit changes.
   */
  onChangeLimit: (newLimit: number) => void;
  /**
   * Called when the enabled status changes.
   */
  onChangeEnabled: (enabled: boolean) => void;
  /**
   * Called when the console is cleared.
   */
  onClear: () => void;
}

/**
 * The device's `Live Inspector` tab.
 */
function LiveInspectorTab(props: ILiveInspectorTabProps) {
  const { enabled, limit, logs, onChangeEnabled, onChangeLimit, onClear } = props;

  return (
    <>
      <FormDivision
        icon={EIcon.search}
        title="Live Inspector"
        description="With Live Inspector, you can check all connections of this device. It’s only visible while you’re visiting this page."
      />

      <LiveInspector
        enabled={enabled}
        limit={limit}
        logs={logs}
        onChangeEnabled={onChangeEnabled}
        onChangeLimit={onChangeLimit}
        onClear={onClear}
      />
    </>
  );
}

export default LiveInspectorTab;
