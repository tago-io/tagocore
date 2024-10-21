import { useTheme } from "styled-components";
import getDateTimeObject from "../../../Helpers/getDateTimeObject.ts";
import RelativeDate from "../../RelativeDate/RelativeDate.tsx";

/**
 * Props.
 */
interface DeviceInputOutputProps {
  value?: Date | string | number | null;
  bold?: boolean;
}

/**
 * Renders the device last_input or last_output values in a relative format. The colors
 * are adjusted based on how long ago the input/output happened.
 */
function DeviceInputOutput(props: DeviceInputOutputProps) {
  const { value } = props;
  const theme = useTheme();
  let color = theme.font;

  const hours3 = 10800000; // 3 hours in milliseconds
  const hours6 = 21600000; // 6 hours in milliseconds
  const day1 = 86400000; // 1 day in milliseconds
  const day3 = day1 * 3; // 3 days in milliseconds

  const timestamp = getDateTimeObject(value)?.toMillis() || 0;
  if (timestamp > Date.now() - hours3) {
    color = theme.deviceInputOutput3Hours;
  } else if (timestamp > Date.now() - hours6) {
    color = theme.deviceInputOutput6Hours;
  } else if (timestamp > Date.now() - day1) {
    color = theme.deviceInputOutput1Day;
  } else if (timestamp > Date.now() - day3) {
    color = theme.deviceInputOutput3Days;
  }

  return <RelativeDate bold={props.bold} color={color} value={props.value} />;
}

export default DeviceInputOutput;
