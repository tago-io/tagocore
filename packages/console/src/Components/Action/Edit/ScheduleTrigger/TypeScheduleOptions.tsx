import { useEffect, useRef } from "react";
import { useTheme } from "styled-components";
import { Col, EIcon, FormGroup, Input, Row } from "../../../../index.ts";
import IconRadio from "../../../IconRadio/IconRadio.tsx";
import Select from "../../../Select/Select.tsx";
import type {
  IScheduleData,
  TScheduleDataIntervalUnit,
  TScheduleDataType,
} from "../../Action.interface";
import MinimumScheduleMessage from "./MinimumScheduleMessage.tsx";
import * as Style from "./TypeScheduleOptions.style";

/**
 * Props.
 */
interface ITypeScheduleOptions {
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

function TypeScheduleOptions(props: ITypeScheduleOptions) {
  const theme = useTheme();
  const inputRef = useRef<HTMLInputElement>(null);
  const { errors, scheduleData, onChangeScheduleData } = props;

  useEffect(() => {
    if (inputRef.current && !scheduleData.interval) {
      inputRef.current.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scheduleData.type]);

  return (
    <Row>
      <Col size="6">
        <FormGroup>
          <IconRadio
            onChange={(type) =>
              onChangeScheduleData({ ...scheduleData, type: type as TScheduleDataType })
            }
            value={scheduleData.type as TScheduleDataType}
            options={[
              {
                label: "By interval",
                icon: EIcon.clock,
                color: scheduleData.type === "interval" ? theme.action : "",
                description: "Every 10 minutes, every 2 days...",
                value: "interval",
              },
              {
                label: "By date",
                icon: EIcon["calendar-alt"],
                color: scheduleData.type === "schedule" ? theme.action : "",
                description: "On the first day of each month...",
                value: "schedule",
              },
            ]}
          />
        </FormGroup>
      </Col>

      <Col size="6">
        {scheduleData.type === "interval" && (
          <FormGroup icon={EIcon.clock} label="Run Action every...">
            <Style.IntervalContainer>
              <Input
                error={errors?.interval}
                ref={inputRef}
                type="number"
                min="0"
                onChange={(e) =>
                  onChangeScheduleData({ ...scheduleData, interval: Number(e.target.value) || 0 })
                }
                value={scheduleData.interval || ""}
              />
              <Select
                error={errors?.interval}
                onChange={(e) =>
                  onChangeScheduleData({
                    ...scheduleData,
                    interval_unit: e.target.value as TScheduleDataIntervalUnit,
                  })
                }
                value={scheduleData.interval_unit || "minute"}
                options={[
                  {
                    value: "minute",
                    label: `Minute${Number(scheduleData.interval) === 1 ? "" : "s"}`,
                  },
                  { value: "hour", label: `Hour${Number(scheduleData.interval) === 1 ? "" : "s"}` },
                  { value: "day", label: `Day${Number(scheduleData.interval) === 1 ? "" : "s"}` },
                  { value: "week", label: `Week${Number(scheduleData.interval) === 1 ? "" : "s"}` },
                  {
                    value: "month",
                    label: `Month${Number(scheduleData.interval) === 1 ? "" : "s"}`,
                  },
                  {
                    value: "quarter",
                    label: `Quarter${Number(scheduleData.interval) === 1 ? "" : "s"}`,
                  },
                  { value: "year", label: `Year${Number(scheduleData.interval) === 1 ? "" : "s"}` },
                ]}
              />
            </Style.IntervalContainer>

            <MinimumScheduleMessage />
          </FormGroup>
        )}
      </Col>
    </Row>
  );
}

export default TypeScheduleOptions;
