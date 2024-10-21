import { useTheme } from "styled-components";
import type { IPluginModuleList } from "@tago-io/tcore-sdk/types";
import { EIcon } from "../../../Icon/Icon.types";
import IconRadio from "../../../IconRadio/IconRadio.tsx";
import Icon from "../../../Icon/Icon.tsx";
import useApiRequest from "../../../../Helpers/useApiRequest.ts";

/**
 * Props.
 */
interface ITriggerRadioProps {
  /**
   * The selected value.
   */
  value: string;
  /**
   * Called when the value changes.
   */
  onChange: (value: string) => void;
}

/**
 * Shows a list of possible action triggers.
 * This shows the default list and all the plugin options too.
 */
function TriggerRadio(props: ITriggerRadioProps) {
  const { data } = useApiRequest<IPluginModuleList>("/module?type=action-trigger");
  const { value, onChange } = props;
  const theme = useTheme();

  /**
   * Renders the options.
   */
  const renderOptions = () => {
    const options = [
      {
        color: value === "condition" ? theme.bucket : theme.font,
        description: "Triggered when the selected variables meet certain conditions.",
        icon: EIcon.database,
        label: "Variable",
        value: "condition",
      },
      {
        color: value === "interval" ? theme.action : theme.font,
        description: "Triggered based on the selected time interval",
        icon: EIcon.clock,
        label: "Schedule",
        value: "interval",
      },
    ];

    for (const item of data || []) {
      const id = `${item.pluginID}:${item.setup.id}`;
      options.push({
        color: value === id ? theme.action : theme.font,
        description: item.setup.option?.description as string,
        icon: EIcon.cog,
        label: item.setup.option?.name,
        value: id,
      });
    }

    return options;
  };

  return (
    <fieldset>
      <legend>
        <Icon icon={EIcon.cog} />
        <span>Select a trigger</span>
      </legend>

      <IconRadio value={value} onChange={onChange} options={renderOptions()} />
    </fieldset>
  );
}

export default TriggerRadio;
