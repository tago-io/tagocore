import { useCallback, useRef, useState } from "react";
import { EIcon, FormGroup } from "../../../../../index.ts";
import type { IScheduleData } from "../../../Action.interface";
import { spreadCronToScheduleData } from "../../Logic/spreadCronToScheduleData.ts";
import * as Style from "./AdvancedCron.style";

/**
 * Props.
 */
interface IAdvancedCron {
  /**
   * Error of the fields.
   */
  errors?: any;
  /**
   * Schedule data of the action.
   */
  scheduleData: IScheduleData;
  /**
   * Function to change the schedule data object.
   */
  onChangeScheduleData: (action: IScheduleData) => void;
}

function AdvancedCron(props: IAdvancedCron) {
  const [highlight, setHighlight] = useState<string>();
  const inputRef = useRef<HTMLInputElement>(null);
  const { errors, scheduleData, onChangeScheduleData } = props;
  const cron = scheduleData.cron || "";

  const changeCron = useCallback(
    (cronString: string) => {
      spreadCronToScheduleData(cronString, scheduleData);
      onChangeScheduleData({ ...scheduleData, cron: cronString });
    },
    [onChangeScheduleData, scheduleData]
  );

  const changeHighlight = useCallback(() => {
    const { selectionStart } = inputRef.current as any;

    let foundSpace = false;
    let foundFirstLetter = false;
    let index = 0;
    for (let i = 0; i < cron.length; i++) {
      const letter = cron[i];

      if (letter === " " && !foundFirstLetter) {
        continue;
      }
      if (letter === " ") {
        foundSpace = true;
      }
      if (letter !== " " && foundSpace) {
        index += 1;
        foundSpace = false;
      }

      foundFirstLetter = true;
      if (i >= selectionStart) {
        break;
      }
    }

    if (index <= 0) {
      setHighlight("minute");
    } else if (index <= 1) {
      setHighlight("hour");
    } else if (index <= 2) {
      setHighlight("day-month");
    } else if (index <= 3) {
      setHighlight("month");
    } else if (index <= 4) {
      setHighlight("day-week");
    } else {
      setHighlight("day-week");
    }
  }, [cron]);

  return (
    <div style={{ margin: "0px -15px" }}>
      <Style.CronInputContainer>
        <FormGroup icon={EIcon.clock} label="Enter the cron schedule" style={{ marginBottom: 0 }}>
          <Style.CronInput
            value={cron}
            ref={inputRef}
            onKeyUp={() => changeHighlight()}
            onClick={() => changeHighlight()}
            error={errors?.cron}
            onBlur={() => {
              changeCron(cron.trim());
              setHighlight(undefined);
            }}
            onChange={(e) => changeCron(e.target.value)}
          />
        </FormGroup>
        <Style.CronFieldsContainer>
          <Style.CronField highlighted={highlight === "minute"}>minute</Style.CronField>
          <Style.CronField highlighted={highlight === "hour"}>hour</Style.CronField>
          <Style.CronField highlighted={highlight === "day-month"}>day (month)</Style.CronField>
          <Style.CronField highlighted={highlight === "month"}>month</Style.CronField>
          <Style.CronField highlighted={highlight === "day-week"}>day (week)</Style.CronField>
        </Style.CronFieldsContainer>
      </Style.CronInputContainer>
    </div>
  );
}

export default AdvancedCron;
