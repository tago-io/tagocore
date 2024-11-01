import { useState } from "react";
import { Accordion, EIcon, Switch } from "../../../../index.ts";
import TooltipText from "../../../TooltipText/TooltipText.tsx";
import VariableCondition from "../../../VariableCondition/VariableCondition.tsx";
import type { IConditionData } from "../../Action.interface";
import DeviceRadio from "./DeviceRadio/DeviceRadio.tsx";

/**
 * Props.
 */
interface IConditionTrigger {
  errors?: any;
  conditionData: IConditionData;
  onChangeConditionData: (value: IConditionData) => void;
}

/**
 * Renders the trigger page for the "condition" action type.
 */
function ConditionTrigger(props: IConditionTrigger) {
  const { errors, conditionData, onChangeConditionData } = props;
  const oneUnlock =
    conditionData.unlockConditions?.some((x) => x.variable || x.value) || false;
  const [unlockOpen, setUnlockOpen] = useState(() => oneUnlock);

  /**
   * Renders the switch to lock the action.
   */
  const renderLockSwitch = () => {
    if (!oneUnlock) {
      return null;
    }
    return (
      <div onClick={(e) => e.stopPropagation()} style={{ marginRight: "5px" }}>
        <Switch
          value={conditionData.lock || false}
          onChange={(e) => onChangeConditionData({ ...conditionData, lock: e })}
          selectedColor="red"
          unselectedColor="rgb(196, 196, 196)"
        >
          <TooltipText tooltip="Triggers are executed only when the action is unlocked. It may be unlocked manually or when the 'Unlock' condition is met.">
            Locked
          </TooltipText>
        </Switch>
      </div>
    );
  };

  return (
    <>
      <DeviceRadio
        device={conditionData.device}
        deviceType={conditionData.type as any}
        onChangeDevice={(device) =>
          onChangeConditionData({ ...conditionData, device })
        }
        onChangeDeviceType={(type: any) =>
          onChangeConditionData({ ...conditionData, type })
        }
        onChangeTag={(tag) => onChangeConditionData({ ...conditionData, tag })}
        tag={conditionData.tag}
        errors={errors}
      />

      <div>
        <Accordion
          icon={EIcon.cog}
          description="If one of the conditions match, the action will be triggered."
          title="Trigger"
          isAlwaysOpen
        >
          <VariableCondition
            name="Trigger"
            data={conditionData?.conditions || []}
            errors={errors?.conditions}
            onChange={(e) =>
              onChangeConditionData({ ...conditionData, conditions: e })
            }
          />
        </Accordion>
      </div>

      <div>
        <Accordion
          icon={EIcon.lock}
          description="Unlocks are conditions that enable the action to be triggered again."
          title="Trigger Unlock"
          subTitle="(optional)"
          onRenderRightSide={renderLockSwitch}
          open={unlockOpen}
          onChangeOpen={setUnlockOpen}
        >
          <VariableCondition
            name="Trigger"
            data={conditionData?.unlockConditions || []}
            errors={errors?.unlockConditions}
            onChange={(e) =>
              onChangeConditionData({ ...conditionData, unlockConditions: e })
            }
          />
        </Accordion>
      </div>
    </>
  );
}

export default ConditionTrigger;
