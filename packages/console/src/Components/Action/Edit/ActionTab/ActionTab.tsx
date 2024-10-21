import type { IAction, IPluginModuleListItem } from "@tago-io/tcore-sdk/types";
import { Input } from "../../../../index.ts";
import FormGroup from "../../../FormGroup/FormGroup.tsx";
import { EIcon } from "../../../Icon/Icon.types";
import PluginConfigFields from "../../../Plugins/Common/PluginConfigFields/PluginConfigFields.tsx";
import ActionFields from "../../Common/ActionFields/ActionFields.tsx";
import ConditionTrigger from "../ConditionTrigger/ConditionTrigger.tsx";
import ScheduleTrigger from "../ScheduleTrigger/ScheduleTrigger.tsx";
import MessageTriggerNotFound from "../ScheduleTrigger/MessageTriggerNotFound/MessageTriggerNotFound.tsx";
import type { IConditionData, IScheduleData } from "../../Action.interface";
import * as Style from "./ActionTab.style";

/**
 * Props.
 */
interface IActionTab {
  action: any;
  conditionData: IConditionData;
  customTrigger?: IPluginModuleListItem;
  data: IAction;
  errors: any;
  onChange: (field: keyof IAction, value: IAction[keyof IAction]) => void;
  onChangeAction: (action: any) => void;
  onChangeConditionData: (conditionData: IConditionData) => void;
  onChangePluginTriggerData: (pluginTriggerData: any) => void;
  onChangeScheduleData: (action: IScheduleData) => void;
  pluginTriggerData: any;
  scheduleData: IScheduleData;
}

/**
 * The action's `Action` tab.
 */
function ActionTab(props: IActionTab) {
  const {
    action,
    customTrigger,
    data,
    errors,
    onChange,
    onChangeAction,
    onChangePluginTriggerData,
    onChangeScheduleData,
    pluginTriggerData,
    scheduleData,
  } = props;

  /**
   * Renders the left section (`Triggers`) of the screen.
   */
  const renderLeftSectionContent = () => {
    if (data.type.includes(":") && !customTrigger) {
      const triggerName = data.type.split(":")[1];
      return <MessageTriggerNotFound isPlugin triggerName={triggerName} />;
    }if (customTrigger) {
      return (
        <PluginConfigFields
          data={customTrigger?.setup?.option?.configs || []}
          errors={errors?.trigger}
          onChangeValues={onChangePluginTriggerData}
          values={pluginTriggerData}
        />
      );
    }if (data.type === "interval" || data.type === "schedule") {
      return (
        <ScheduleTrigger
          errors={errors}
          onChangeScheduleData={onChangeScheduleData}
          scheduleData={scheduleData}
        />
      );
    }if (data.type === "condition") {
      return (
        <ConditionTrigger
          conditionData={props.conditionData}
          errors={errors}
          onChangeConditionData={props.onChangeConditionData}
        />
      );
    }
      return <MessageTriggerNotFound triggerName={data.type} />;
  };

  /**
   * Renders the left section (`Action`) of the screen.
   */
  const renderRightSectionContent = () => {
    return (
      <>
        <div>
          <FormGroup icon={EIcon["pencil-alt"]} label="Name">
            <Input
              error={errors?.name}
              errorMessage="This field requires at least 3 characters"
              onChange={(e) => onChange("name", e.target.value)}
              placeholder="Enter a name that describes the purpose of your action"
              value={data.name}
            />
          </FormGroup>
        </div>

        <ActionFields
          triggerID={data?.type}
          errors={errors?.action}
          action={action}
          onChangeAction={onChangeAction}
        />
      </>
    );
  };

  return (
    <Style.Container>
      <Style.LeftSection>
        <div className="title">Trigger</div>
        {renderLeftSectionContent()}
      </Style.LeftSection>

      <Style.RightSection>
        <div className="title">Action</div>
        {renderRightSectionContent()}
      </Style.RightSection>
    </Style.Container>
  );
}

export default ActionTab;
