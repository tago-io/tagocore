import * as cronstrue from "cronstrue";
import { type CSSProperties, useCallback, useEffect, useState } from "react";
import { EIcon } from "../../../../index.ts";
import FormDivision from "../../../FormDivision/FormDivision.tsx";
import Select from "../../../Select/Select.tsx";
import TimezonePicker from "../../../TimezonePicker/TimezonePicker.tsx";
import type { IScheduleData } from "../../Action.interface";
import { getCronFromScheduleData } from "../Logic/getCronFromScheduleData.ts";
import AdvancedCron from "./AdvancedCron/AdvancedCron.tsx";
import BasicCron from "./BasicCron/BasicCron.tsx";
import MinimumScheduleMessage from "./MinimumScheduleMessage.tsx";
import * as Style from "./ScheduleTrigger.style";
import TypeScheduleOptions from "./TypeScheduleOptions.tsx";

/**
 * Props.
 */
interface IScheduleTrigger {
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

function ScheduleTrigger(props: IScheduleTrigger) {
  const [cronExplanation, setCronExplanation] = useState("");
  const { errors, scheduleData, onChangeScheduleData } = props;
  const { timezone } = scheduleData;

  const optionsSelectStyle: CSSProperties = {
    marginLeft: "4px",
    width: "120px",
  };

  const timezoneContainerStyle: CSSProperties = {
    width: "200px",
  };

  const onChange = useCallback(
    (field: string, value: any) => {
      if (!scheduleData.cron) {
        scheduleData.cron = getCronFromScheduleData(scheduleData);
      }
      onChangeScheduleData({ ...scheduleData, [field]: value });
    },
    [onChangeScheduleData, scheduleData],
  );

  useEffect(() => {
    const explanation = getCronExplanation(scheduleData.cron || "");
    setCronExplanation(explanation);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scheduleData.cron]);

  const showExplanation =
    cronExplanation &&
    (scheduleData.canRender || scheduleData.recurrenceType === "advanced");

  return (
    <>
      <div>
        <TypeScheduleOptions
          errors={errors}
          scheduleData={scheduleData}
          onChangeScheduleData={onChangeScheduleData}
        />
      </div>

      {scheduleData.type === "schedule" && (
        <div style={{ position: "relative" }}>
          <Style.Header>
            <FormDivision
              icon={EIcon["calendar-alt"]}
              title="Recurrence options"
              renderBorder
            />

            <div className="right-side-options">
              <div style={timezoneContainerStyle}>
                <TimezonePicker
                  error={errors?.timezone}
                  onChange={(tz) => onChange("timezone", tz)}
                  value={timezone}
                />
              </div>

              <Select
                value={scheduleData.recurrenceType || "basic"}
                onChange={(e) => onChange("recurrenceType", e.target.value)}
                style={optionsSelectStyle}
                options={[
                  { value: "basic", label: "Basic" },
                  { value: "advanced", label: "Advanced" },
                ]}
              />
            </div>
          </Style.Header>

          {scheduleData.recurrenceType === "advanced" ? (
            <AdvancedCron
              errors={errors}
              scheduleData={scheduleData}
              onChangeScheduleData={onChangeScheduleData}
            />
          ) : (
            <BasicCron
              errors={errors}
              scheduleData={scheduleData}
              onChangeScheduleData={onChangeScheduleData}
            />
          )}

          {showExplanation && (
            <div style={{ textAlign: "center" }}>
              <span> This action will run {cronExplanation}.</span>
              <MinimumScheduleMessage />
            </div>
          )}
        </div>
      )}
    </>
  );
}

function getCronExplanation(cron: string) {
  try {
    let cronAsString = cronstrue.toString(cron);
    cronAsString =
      cronAsString.charAt(0).toLowerCase() + cronAsString.substring(1);
    return cronAsString;
  } catch (ex) {
    return "";
  }
}

export default ScheduleTrigger;
