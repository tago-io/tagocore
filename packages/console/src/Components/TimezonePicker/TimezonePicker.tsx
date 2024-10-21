import { useCallback } from "react";
import OptionsPicker from "../OptionsPicker/OptionsPicker.tsx";
import timezonesJSON from "./timezones.json";

/**
 * Maps all the timezones to a better format.
 */
const timezones = timezonesJSON.map((tz) => {
  const correctOffset = [tz.offset.slice(0, 3), ":", tz.offset.slice(3)].join("");
  return {
    id: tz.name,
    name: `(GMT${correctOffset}) ${tz.shortname}`,
  };
});

/**
 * Props.
 */
interface ITimezonePicker {
  /**
   * any object.
   */
  value: any | undefined;
  /**
   * Called when a new any gets picked.
   */
  onChange: (value: any) => void;
  /**
   * Indicates if the this field has an error.
   */
  error?: boolean;
  /**
   * Position of the options container. Default is `bottom`.
   */
  optionsPosition?: "top" | "bottom";
}

/**
 */
function TimezonePicker(props: ITimezonePicker) {
  const { error, optionsPosition } = props;

  /**
   * Retrieves the options.
   */
  const onGetOptions = useCallback(async (query: string, page: number) => {
    if (page === 1) {
      const queryTrim = query.toLowerCase().trim();
      return timezones.filter((x) => x.name.toLowerCase().trim().includes(queryTrim));
    }
      return [];
  }, []);

  /**
   * Resolves an option by an ID.
   * This transforms the ID into an object.
   */
  const resolveOptionByID = useCallback(async (id: string | number) => {
    const analysis = timezones.find((x) => x.id === id);
    return analysis;
  }, []);

  /**
   * Renders a single option row.
   */
  const renderOption = useCallback((i) => {
    return i.name;
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
