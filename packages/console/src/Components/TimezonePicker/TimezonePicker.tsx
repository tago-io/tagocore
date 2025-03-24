import { useCallback } from "react";
import OptionsPicker from "../OptionsPicker/OptionsPicker.tsx";
import timezonesJSON from "./timezones.json";

/** Formatted timezones. */
const TIMEZONES = timezonesJSON.map((tz) => {
  const correctOffset = [tz.offset.slice(0, 3), ":", tz.offset.slice(3)].join(
    "",
  );
  return {
    id: tz.name,
    name: `(GMT${correctOffset}) ${tz.shortname}`,
  };
});

interface ITimezonePicker {
  value: any | undefined;
  error?: boolean;
  /**
   * Position of the options container.
   *
   * @default "bottom"
   */
  optionsPosition?: "top" | "bottom";
  onChange: (value: any) => void;
}

function TimezonePicker(props: ITimezonePicker) {
  const { error, optionsPosition } = props;

  const onGetOptions = useCallback(async (query: string, page: number) => {
    if (page === 1) {
      const queryTrim = query.toLowerCase().trim();
      return TIMEZONES.filter((tz) =>
        tz.name.toLowerCase().trim().includes(queryTrim),
      );
    }
    return [];
  }, []);

  const resolveOptionByID = useCallback(async (id: string | number) => {
    const analysis = TIMEZONES.find((tz) => tz.id === id);
    return analysis;
  }, []);

  const renderOption = useCallback((tz: { name: string }) => {
    return tz.name;
  }, []);

  return (
    <OptionsPicker<any>
      doesRequest
      error={error}
      labelField="name"
      onChange={props.onChange}
      onGetOptions={onGetOptions}
      onRenderOption={renderOption}
      onResolveOption={resolveOptionByID}
      placeholder="Select a timezone"
      optionsPosition={optionsPosition}
      value={props.value}
    />
  );
}

export default TimezonePicker;
