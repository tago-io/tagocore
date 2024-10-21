import { DateTime } from "luxon";
import { useRef, useState, useEffect } from "react";
import Select from "../Select/Select.tsx";
import * as Style from "./InputTime.style";

interface IInputTime {
  value?: string;
  timeFormat?: "12" | "24";
  onChange: (time: string) => void;
}

function InputTime(props: IInputTime) {
  const firstRender = useRef(true);
  const usesAmPmFormat = props.timeFormat === "12";
  const defaultValue = `2010-01-01 ${props.value || ""}`;
  const [hour, setHour] = useState(() =>
    DateTime.fromFormat(defaultValue, "yyyy-LL-dd HH:mm").toFormat(usesAmPmFormat ? "hh" : "HH")
  );
  const [minute, setMinute] = useState(() =>
    DateTime.fromFormat(defaultValue, "yyyy-LL-dd HH:mm").toFormat("mm")
  );
  const [format, setFormat] = useState(() =>
    DateTime.fromFormat(defaultValue, "yyyy-LL-dd HH:mm").toFormat("a").toLowerCase()
  );

  function getOptionsOfSelect(amount: number) {
    const hideZero = amount === 12;
    return new Array(amount).fill("").map((x, i) => {
      const value = hideZero ? String(i + 1).padStart(2, "0") : String(i).padStart(2, "0");
      return { label: value, value };
    });
  }

  /**
   * Triggers change to the input outside.
   * This function will format the date using the time that we selected and the time format as well.
   */
  function triggerChange() {
    if (usesAmPmFormat) {
      props.onChange(`${hour || "00"}:${minute || "00"} ${format}`);
    } else {
      props.onChange(`${hour || "00"}:${minute || "00"}`);
    }
  }

  /**
   * Uses to trigger a change to the input outside if the hour, minute or time format has changed.
   * We ignore the first one because it's not needed.
   */
  useEffect(() => {
    if (!firstRender.current) {
      triggerChange();
    }
    firstRender.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hour, minute, format]);

  return (
    <Style.Container hasFormat={usesAmPmFormat}>
      <Select
        value={hour}
        onChange={(e) => setHour(e.target.value)}
        options={getOptionsOfSelect(usesAmPmFormat ? 12 : 24)}
      />

      <div className="time-separator">
        <span>:</span>
      </div>

      <Select
        value={minute}
        onChange={(e) => setMinute(e.target.value)}
        options={getOptionsOfSelect(60)}
      />

      {usesAmPmFormat && (
        <Select
          value={format}
          onChange={(e) => setFormat(e.target.value)}
          options={[
            { value: "am", label: "AM" },
            { value: "pm", label: "PM" },
          ]}
        />
      )}
    </Style.Container>
  );
}

export default InputTime;
